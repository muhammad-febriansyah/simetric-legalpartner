<?php

namespace Database\Seeders;

use App\Models\Article;
use Database\Seeders\Concerns\CopiesDemoAssets;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleDemoSeeder extends Seeder
{
    use CopiesDemoAssets;

    /**
     * Seed blog articles from database/seeders/data/articles.php.
     */
    public function run(): void
    {
        /** @var list<array<string, mixed>> $articles */
        $articles = require database_path('seeders/data/articles.php');

        foreach ($articles as $article) {
            $isPublished = $article['days_ago'] !== null;

            Article::query()->updateOrCreate(
                ['slug' => $article['slug']],
                [
                    'title' => $article['title'],
                    'excerpt' => $article['excerpt'],
                    'content' => $article['content'],
                    'category_label' => $article['category'],
                    'cover_image' => $this->publishDemoAsset("articles/{$article['image']}.jpg", 'articles'),
                    'cover_alt' => $article['alt'],
                    'author_name' => $article['author'],
                    'status' => $isPublished ? 'published' : 'draft',
                    'published_at' => $isPublished ? now()->subDays($article['days_ago'])->setTime(9, 0) : null,
                    'meta_title' => Str::limit($article['title'], 70, ''),
                    'meta_description' => Str::limit($article['excerpt'], 160),
                ],
            );
        }
    }
}
