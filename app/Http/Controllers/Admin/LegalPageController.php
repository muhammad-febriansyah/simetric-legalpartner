<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LegalPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LegalPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/legal-pages/index', [
            'pages' => LegalPage::query()
                ->orderBy('sort_order')
                ->get(['id', 'title', 'slug', 'content', 'status', 'published_at'])
                ->map(fn (LegalPage $page): array => [
                    'id' => $page->id,
                    'title' => $page->title,
                    'slug' => $page->slug,
                    'content' => $page->content,
                    'status' => $page->status,
                    'publishedAt' => $page->published_at?->toIso8601String(),
                ]),
        ]);
    }

    public function update(Request $request, LegalPage $legalPage): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:100000'],
            'status' => ['required', 'string', Rule::in(['draft', 'published'])],
        ]);

        $legalPage->update([
            'content' => $validated['content'],
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published'
                ? ($legalPage->published_at ?? now())
                : null,
        ]);

        return back();
    }
}
