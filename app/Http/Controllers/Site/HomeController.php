<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Faq;
use App\Models\Partner;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use App\Support\ArticleSummary;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $activeServices = fn (): Builder => Service::query()
            ->where('is_active', true)
            ->whereHas('category', fn (Builder $query) => $query->where('is_active', true));

        $featured = $activeServices()
            ->with([
                'category:id,name,slug',
                'packages' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
            ])
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->limit(6)
            ->get()
            ->map(fn (Service $service): array => [
                'name' => $service->name,
                'slug' => $service->slug,
                'excerpt' => $service->excerpt,
                'heroImage' => $this->imageUrl($service->hero_image),
                'heroImageAlt' => $service->hero_image_alt,
                'durationLabel' => $service->duration_label,
                'isFeatured' => $service->is_featured,
                'category' => $service->category->name,
                'startingPrice' => $service->packages->whereNotNull('price')->min('price'),
                'popularPackage' => ($package = $service->packages->firstWhere('is_popular', true) ?? $service->packages->first())
                    ? ['name' => $package->name, 'price' => $package->price]
                    : null,
            ])
            ->all();

        $faqs = Faq::query()
            ->where('is_active', true)
            ->whereHas('service', fn (Builder $query) => $query->where('is_active', true))
            ->with('service:id,name')
            ->orderBy('sort_order')
            ->orderBy('service_id')
            ->limit(6)
            ->get()
            ->map(fn (Faq $faq): array => [
                'question' => $faq->question,
                'answer' => $faq->answer,
                'service' => $faq->service->name,
            ])
            ->all();

        return inertia('public/home', [
            'featured' => $featured,
            'categories' => ServiceCategory::query()
                ->where('is_active', true)
                ->withCount(['services as services_count' => fn (Builder $query) => $query->where('is_active', true)])
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'description'])
                ->map(fn (ServiceCategory $category): array => [
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'servicesCount' => (int) $category->services_count,
                ])
                ->all(),
            'partners' => Partner::query()
                ->orderBy('name')
                ->get()
                ->map(fn (Partner $partner): array => ['name' => $partner->name, 'logo' => (string) $this->imageUrl($partner->image_path)])
                ->all(),
            'articles' => Article::query()
                ->where('status', 'published')
                ->where('published_at', '<=', now())
                ->latest('published_at')
                ->limit(3)
                ->get()
                ->map(ArticleSummary::from(...))
                ->all(),
            'faqs' => $faqs,
            'stats' => [
                'services' => $activeServices()->count(),
                'packages' => ServicePackage::query()->where('is_active', true)->count(),
                'articles' => Article::query()->where('status', 'published')->where('published_at', '<=', now())->count(),
            ],
        ]);
    }

    private function imageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        return str_starts_with($path, '/') ? $path : Storage::disk('public')->url($path);
    }
}
