<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Support\ArticleSummary;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Response;

class ArticleController extends Controller
{
    private const PER_PAGE = 10;

    public function index(Request $request): Response
    {
        $search = trim($request->string('q')->toString());
        $category = trim($request->string('kategori')->toString());

        $articles = $this->published()
            ->when($search !== '', function (Builder $query) use ($search): void {
                $term = '%'.addcslashes($search, '%_\\').'%';

                $query->where(fn (Builder $nested) => $nested
                    ->where('title', 'like', $term)
                    ->orWhere('excerpt', 'like', $term));
            })
            ->when($category !== '', fn (Builder $query) => $query->where('category_label', $category))
            ->latest('published_at')
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(ArticleSummary::from(...));

        return inertia('public/blog/index', [
            'articles' => $articles,
            'categories' => $this->published()
                ->whereNotNull('category_label')
                ->selectRaw('category_label as name, count(*) as total')
                ->groupBy('category_label')
                ->orderBy('category_label')
                ->get()
                ->map(fn (Article $row): array => ['name' => $row->name, 'total' => (int) $row->total])
                ->all(),
            'filters' => ['q' => $search, 'kategori' => $category],
        ]);
    }

    public function show(string $slug): Response
    {
        $article = $this->published()->where('slug', $slug)->firstOrFail();

        $related = $this->published()
            ->whereKeyNot($article->id)
            ->when($article->category_label, fn (Builder $query, string $label) => $query->orderByRaw('category_label = ? desc', [$label]))
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->map(ArticleSummary::from(...))
            ->all();

        return inertia('public/blog/show', [
            'article' => [
                ...ArticleSummary::from($article),
                'content' => $article->content,
                'metaTitle' => $article->meta_title ?: $article->title,
                'metaDescription' => $article->meta_description ?: $article->excerpt,
            ],
            'related' => $related,
        ]);
    }

    /**
     * @return Builder<Article>
     */
    private function published(): Builder
    {
        return Article::query()
            ->where('status', 'published')
            ->where('published_at', '<=', now());
    }
}
