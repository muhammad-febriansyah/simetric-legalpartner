<?php

namespace App\Support;

use App\Models\Article;
use Illuminate\Support\Facades\Storage;

class ArticleSummary
{
    /**
     * @return array{title: string, slug: string, excerpt: ?string, category: ?string, author: string, publishedAt: ?string, readingMinutes: int, coverImage: ?string, coverAlt: ?string}
     */
    public static function from(Article $article): array
    {
        return [
            'title' => $article->title,
            'slug' => $article->slug,
            'excerpt' => $article->excerpt,
            'category' => $article->category_label,
            'author' => $article->author_name,
            'publishedAt' => $article->published_at?->toIso8601String(),
            'readingMinutes' => max(1, (int) ceil(str_word_count(strip_tags($article->content)) / 200)),
            'coverImage' => $article->cover_image ? Storage::disk('public')->url($article->cover_image) : null,
            'coverAlt' => $article->cover_alt,
        ];
    }
}
