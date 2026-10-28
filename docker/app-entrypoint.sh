#!/bin/sh
set -eu

cd /var/www/html

php artisan config:cache
php artisan view:cache
php artisan storage:link --force
chown -R www-data:www-data storage/app/public

exec "$@"
