<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArticleRequest;
use App\Http\Requests\Admin\UpdateArticleRequest;
use App\Models\Article;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->query('status');
        $articles = Article::query()
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%")
                        ->orWhere('category_label', 'like', "%{$search}%");
                });
            })
            ->when(in_array($status, ['draft', 'published'], true), fn (Builder $query) => $query->where('status', $status))
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Article $article): array => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'categoryLabel' => $article->category_label,
                'authorName' => $article->author_name,
                'status' => $article->status,
                'publishedAt' => $article->published_at?->toIso8601String(),
                'updatedAt' => $article->updated_at?->toIso8601String(),
                'coverImage' => $this->imageUrl($article->cover_image),
            ]);

        return Inertia::render('admin/articles/index', [
            'articles' => $articles,
            'search' => $search,
            'status' => in_array($status, ['draft', 'published'], true) ? $status : '',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/articles/create');
    }

    public function store(StoreArticleRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $imagePath = $request->file('cover_image_file')?->store('articles', 'public');

        try {
            $article = Article::query()->create($this->articleAttributes($validated, $imagePath));
        } catch (Throwable $exception) {
            if ($imagePath !== null) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $exception;
        }

        return to_route('admin.articles.edit', $article);
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('admin/articles/edit', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'categoryLabel' => $article->category_label,
                'coverImage' => $this->imageUrl($article->cover_image),
                'coverAlt' => $article->cover_alt,
                'authorName' => $article->author_name,
                'status' => $article->status,
                'metaTitle' => $article->meta_title,
                'metaDescription' => $article->meta_description,
            ],
        ]);
    }

    public function update(UpdateArticleRequest $request, Article $article): RedirectResponse
    {
        $validated = $request->validated();
        $oldImagePath = $article->cover_image;
        $newImagePath = $request->file('cover_image_file')?->store('articles', 'public');

        try {
            $article->update($this->articleAttributes($validated, $newImagePath ?? $oldImagePath, $article));
        } catch (Throwable $exception) {
            if ($newImagePath !== null) {
                Storage::disk('public')->delete($newImagePath);
            }

            throw $exception;
        }

        if ($newImagePath !== null && $oldImagePath !== $newImagePath) {
            $this->deleteStoredImage($oldImagePath);
        }

        return to_route('admin.articles.edit', $article);
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->deleteStoredImage($article->cover_image);
        $article->delete();

        return to_route('admin.articles.index');
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function articleAttributes(array $validated, ?string $imagePath, ?Article $article = null): array
    {
        $title = $validated['title'];
        $slug = trim((string) ($validated['slug'] ?? ''));
        $status = $validated['status'];

        return [
            'title' => $title,
            'slug' => $this->uniqueSlug($slug !== '' ? $slug : $title, $article),
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => strip_tags($validated['content']),
            'category_label' => $validated['category_label'] ?? null,
            'cover_image' => $imagePath,
            'cover_alt' => $validated['cover_alt'] ?? null,
            'author_name' => $validated['author_name'],
            'status' => $status,
            'published_at' => $status === 'published' ? ($article?->published_at ?? now()) : null,
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
        ];
    }

    private function uniqueSlug(string $value, ?Article $article = null): string
    {
        $baseSlug = Str::slug($value) ?: 'artikel';
        $slug = $baseSlug;
        $suffix = 2;

        while (Article::query()
            ->where('slug', $slug)
            ->when($article !== null, fn (Builder $query) => $query->whereKeyNot($article->id))
            ->exists()) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? Storage::disk('public')->url($path) : null;
    }

    private function deleteStoredImage(?string $path): void
    {
        if ($path !== null && str_starts_with($path, 'articles/')) {
            Storage::disk('public')->delete($path);
        }
    }
}
