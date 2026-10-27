<?php

namespace App\Http\Middleware;

use App\Models\LegalPage;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'siteBrand' => fn (): array => $this->siteBrand(),
            'siteContact' => fn (): array => $this->siteContact($request),
            'siteFooter' => fn (): array => $this->siteFooter($request),
            'serviceMenu' => fn (): array => $this->serviceMenu($request),
            'adminNotifications' => fn (): array => $this->adminNotifications($request),
        ];
    }

    /**
     * @return array{unreadCount: int, items: list<array{id: string, title: string, description: string, categoryLabel: string, readAt: ?string, createdAt: ?string, partnershipApplicationId: ?int}>}
     */
    private function adminNotifications(Request $request): array
    {
        $user = $request->user();

        if (! $user instanceof User) {
            return [
                'unreadCount' => 0,
                'items' => [],
            ];
        }

        return [
            'unreadCount' => $user->unreadNotifications()->count(),
            'items' => $user->notifications()
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn (DatabaseNotification $notification): array => [
                    'id' => (string) $notification->id,
                    'title' => (string) ($notification->data['title'] ?? 'Notifikasi'),
                    'description' => (string) ($notification->data['description'] ?? ''),
                    'categoryLabel' => (string) ($notification->data['categoryLabel'] ?? 'Aktivitas'),
                    'readAt' => $notification->read_at?->toIso8601String(),
                    'createdAt' => $notification->created_at?->toIso8601String(),
                    'partnershipApplicationId' => isset($notification->data['partnershipApplicationId'])
                        ? (int) $notification->data['partnershipApplicationId']
                        : null,
                ])
                ->all(),
        ];
    }

    /**
     * Active categories with their active services, used by the public navbar mega menu.
     *
     * @return list<array{name: string, slug: string, services: list<array{name: string, slug: string, excerpt: ?string, isFeatured: bool, startingPrice: ?int}>}>
     */
    private function serviceMenu(Request $request): array
    {
        if ($request->is('admin/*', 'dashboard', 'settings/*')) {
            return [];
        }

        return ServiceCategory::query()
            ->where('is_active', true)
            ->with(['services' => fn ($query) => $query
                ->where('is_active', true)
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->withMin(['packages as starting_price' => fn ($packages) => $packages->where('is_active', true)], 'price')
                ->select(['id', 'service_category_id', 'name', 'slug', 'excerpt', 'is_featured']),
            ])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->map(fn (ServiceCategory $category): array => [
                'name' => $category->name,
                'slug' => $category->slug,
                'services' => $category->services->map(fn ($service): array => [
                    'name' => $service->name,
                    'slug' => $service->slug,
                    'excerpt' => $service->excerpt,
                    'isFeatured' => (bool) $service->is_featured,
                    'startingPrice' => $service->starting_price !== null ? (int) $service->starting_price : null,
                ])->all(),
            ])
            ->all();
    }

    /**
     * Brand, contact, social, and legal page details shown in the public footer.
     *
     * @return array{name: string, byline: ?string, tagline: ?string, address: ?string, phone: ?string, email: ?string, whatsapp: ?string, socials: list<array{key: string, label: string, url: string}>, legalPages: list<array{title: string, slug: string}>, topServices: list<array{name: string, slug: string}>}|array{}
     */
    private function siteFooter(Request $request): array
    {
        if ($request->is('admin/*', 'dashboard', 'settings/*')) {
            return [];
        }

        $settings = SiteSetting::query()
            ->whereIn('key', [
                'site_name', 'brand_byline', 'site_tagline', 'contact_address', 'contact_phone', 'contact_email', 'whatsapp_number',
                'social_instagram', 'social_facebook', 'social_linkedin', 'social_tiktok', 'social_youtube', 'social_x',
            ])
            ->pluck('value', 'key');

        $socials = $this->socials($settings);

        return [
            'name' => $settings->get('site_name') ?: 'LegalPartner.ID',
            'byline' => $settings->get('brand_byline') ?: null,
            'tagline' => $settings->get('site_tagline') ?: null,
            'address' => $settings->get('contact_address') ?: null,
            'phone' => $settings->get('contact_phone') ?: null,
            'email' => $settings->get('contact_email') ?: null,
            'whatsapp' => preg_replace('/\D+/', '', (string) $settings->get('whatsapp_number')) ?: null,
            'socials' => $socials,
            'legalPages' => LegalPage::query()
                ->where('status', 'published')
                ->orderBy('sort_order')
                ->get(['title', 'slug'])
                ->map(fn (LegalPage $page): array => ['title' => $page->title, 'slug' => $page->slug])
                ->all(),
            'topServices' => Service::query()
                ->where('is_active', true)
                ->whereHas('category', fn ($query) => $query->where('is_active', true))
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->limit(6)
                ->get(['name', 'slug'])
                ->map(fn (Service $service): array => ['name' => $service->name, 'slug' => $service->slug])
                ->all(),
        ];
    }

    /**
     * @param  Collection<string, mixed>  $settings
     * @return list<array{key: string, label: string, url: string}>
     */
    private function socials(Collection $settings): array
    {
        $labels = [
            'social_instagram' => 'Instagram', 'social_facebook' => 'Facebook', 'social_linkedin' => 'LinkedIn',
            'social_tiktok' => 'TikTok', 'social_youtube' => 'YouTube', 'social_x' => 'X',
        ];

        return collect($labels)
            ->map(fn (string $label, string $key): array => ['key' => str_replace('social_', '', $key), 'label' => $label, 'url' => (string) $settings->get($key)])
            ->filter(fn (array $social): bool => str_starts_with($social['url'], 'http'))
            ->values()
            ->all();
    }

    /**
     * Public contact details shown in the navbar utility bar.
     *
     * @return array{email: ?string, whatsapp: ?string, hours: ?string, socials: list<array{key: string, label: string, url: string}>}
     */
    private function siteContact(Request $request): array
    {
        if ($request->is('admin/*', 'dashboard', 'settings/*')) {
            return ['email' => null, 'whatsapp' => null, 'hours' => null, 'socials' => []];
        }

        $settings = SiteSetting::query()
            ->whereIn('key', [
                'contact_email', 'whatsapp_number', 'business_hours',
                'social_instagram', 'social_facebook', 'social_linkedin', 'social_tiktok', 'social_youtube', 'social_x',
            ])
            ->pluck('value', 'key');

        return [
            'email' => $settings->get('contact_email') ?: null,
            'whatsapp' => preg_replace('/\D+/', '', (string) $settings->get('whatsapp_number')) ?: null,
            'hours' => $settings->get('business_hours') ?: null,
            'socials' => $this->socials($settings),
        ];
    }

    /**
     * @return array{logo: string, favicon: string, logoAltText: string}
     */
    private function siteBrand(): array
    {
        $settings = SiteSetting::query()
            ->whereIn('key', ['logo_path', 'favicon_path', 'logo_alt_text'])
            ->pluck('value', 'key');

        $assetUrl = static function (?string $path, string $fallback): string {
            if (! $path) {
                return $fallback;
            }

            return str_starts_with($path, '/') ? $path : Storage::disk('public')->url($path);
        };

        return [
            'logo' => $assetUrl($settings->get('logo_path'), '/images/legalpartner-logo.png'),
            'favicon' => $assetUrl($settings->get('favicon_path'), '/images/legalpartner-favicon-192.png'),
            'logoAltText' => $settings->get('logo_alt_text') ?: 'LegalPartner.ID by Simetric Consulting Group',
        ];
    }
}
