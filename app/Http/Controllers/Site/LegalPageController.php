<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\LegalPage;
use Inertia\Response;

class LegalPageController extends Controller
{
    public function show(string $slug): Response
    {
        $page = LegalPage::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return inertia('public/legal', [
            'page' => [
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content,
                'updatedAt' => $page->updated_at?->toIso8601String(),
            ],
        ]);
    }
}
