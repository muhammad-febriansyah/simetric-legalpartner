FROM node:22-bookworm-slim AS node
FROM composer:2 AS composer

FROM php:8.4-fpm-bookworm AS php-runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libfreetype6 \
        libicu72 \
        libjpeg62-turbo \
        libonig5 \
        libpng16-16 \
        libzip4 \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libonig-dev \
        libpng-dev \
        libzip-dev \
        $PHPIZE_DEPS \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" bcmath exif gd intl mbstring opcache pdo_mysql zip \
    && apt-get purge -y --auto-remove \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libonig-dev \
        libpng-dev \
        libzip-dev \
        $PHPIZE_DEPS \
    && rm -rf /var/lib/apt/lists/*

RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.enable_cli=0'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.max_accelerated_files=20000'; \
    } > /usr/local/etc/php/conf.d/zz-production.ini

RUN printf '[www]\nclear_env = no\n' > /usr/local/etc/php-fpm.d/zz-env.conf

FROM php-runtime AS app-build

COPY --from=node /usr/local/ /usr/local/
COPY --from=composer /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN composer dump-autoload --no-dev --classmap-authoritative --no-scripts \
    && php artisan package:discover --ansi \
    && php artisan storage:link --force \
    && npm run build

FROM php-runtime AS app

WORKDIR /var/www/html

COPY --from=app-build --chown=www-data:www-data /var/www/html /var/www/html
COPY --chmod=755 docker/app-entrypoint.sh /usr/local/bin/app-entrypoint

RUN mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

ENTRYPOINT ["/usr/local/bin/app-entrypoint"]
CMD ["php-fpm", "-F"]

FROM nginx:1.27-alpine AS web

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=app-build /var/www/html/public /var/www/html/public

WORKDIR /var/www/html
