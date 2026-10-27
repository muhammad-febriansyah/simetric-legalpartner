<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:150'],
        ]);
        $search = trim($validated['q'] ?? '');

        $servicesQuery = Service::query()
            ->where('is_active', true)
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->with([
                'category:id,name,slug',
                'packages' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
            ]);

        if ($search !== '') {
            $servicesQuery->where(function (Builder $query) use ($search): void {
                $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhereHas('category', fn (Builder $categoryQuery) => $categoryQuery->where('name', 'like', "%{$search}%"));
            });
        }

        $services = $servicesQuery
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Service $service): array => [
                'name' => $service->name,
                'slug' => $service->slug,
                'excerpt' => $service->excerpt,
                'heroImage' => $this->imageUrl($service->hero_image),
                'heroImageAlt' => $service->hero_image_alt,
                'durationLabel' => $service->duration_label,
                'isFeatured' => $service->is_featured,
                'category' => [
                    'name' => $service->category->name,
                    'slug' => $service->category->slug,
                ],
                'startingPrice' => $service->packages
                    ->whereNotNull('price')
                    ->min('price'),
            ]);

        return inertia('public/services/index', [
            'services' => $services,
            'filters' => [
                'q' => $search,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $service = Service::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->with([
                'category:id,name,slug',
                'packages' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
                'addons' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
                'faqs' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
            ])
            ->firstOrFail();

        return inertia('public/services/show', [
            'whatsappNumber' => SiteSetting::query()
                ->where('key', 'whatsapp_number')
                ->value('value'),
            'service' => [
                'name' => $service->name,
                'slug' => $service->slug,
                'excerpt' => $service->excerpt,
                'description' => $service->description,
                'heroImage' => $this->imageUrl($service->hero_image),
                'heroImageAlt' => $service->hero_image_alt,
                'durationLabel' => $service->duration_label,
                'requirements' => $service->requirements ?? [],
                'processSteps' => $service->process_steps ?? [],
                'category' => [
                    'name' => $service->category->name,
                    'slug' => $service->category->slug,
                ],
                'packages' => $service->packages->map(fn ($package): array => [
                    'name' => $package->name,
                    'slug' => $package->slug,
                    'description' => $package->description,
                    'price' => $package->price,
                    'priceLabel' => $package->price_label,
                    'features' => $package->features ?? [],
                    'isPopular' => $package->is_popular,
                ])->values(),
                'addons' => $service->addons->map(fn ($addon): array => [
                    'name' => $addon->name,
                    'description' => $addon->description,
                    'price' => $addon->price,
                ])->values(),
                'faqs' => $service->faqs->map(fn ($faq): array => [
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                ])->values(),
            ],
        ]);
    }

    private function imageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        if (str_starts_with($path, '/') || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
