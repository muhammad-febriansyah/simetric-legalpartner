<?php

use App\Models\Article;
use App\Models\Faq;
use App\Models\Partner;
use App\Models\PartnershipApplication;
use App\Models\Service;
use App\Models\ServiceAddon;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use App\Models\User;
use Database\Seeders\ArticleDemoSeeder;
use Database\Seeders\CatalogDemoSeeder;
use Database\Seeders\PartnerDemoSeeder;
use Database\Seeders\PartnershipApplicationDemoSeeder;
use Database\Seeders\UserDemoSeeder;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');

    $this->seed([
        CatalogDemoSeeder::class,
        ArticleDemoSeeder::class,
        PartnerDemoSeeder::class,
        PartnershipApplicationDemoSeeder::class,
        UserDemoSeeder::class,
    ]);
});

test('demo seeders fill every admin menu with realistic volumes', function () {
    expect(ServiceCategory::count())->toBe(8)
        ->and(Service::count())->toBe(20)
        ->and(ServicePackage::count())->toBe(60)
        ->and(ServiceAddon::count())->toBeGreaterThanOrEqual(20)
        ->and(Faq::count())->toBe(40)
        ->and(Article::count())->toBe(20)
        ->and(Article::where('status', 'published')->count())->toBe(17)
        ->and(Partner::count())->toBe(20)
        ->and(PartnershipApplication::count())->toBe(20)
        ->and(User::count())->toBe(19);
});

test('every seeded record points to an image that exists on the public disk', function () {
    $paths = collect()
        ->merge(Service::pluck('hero_image'))
        ->merge(Article::pluck('cover_image'))
        ->merge(Partner::pluck('image_path'));

    expect($paths)->toHaveCount(60);

    $paths->each(fn (string $path) => expect(Storage::disk('public')->exists($path))->toBeTrue());
});

test('seeding twice does not duplicate records', function () {
    $this->seed([CatalogDemoSeeder::class, ArticleDemoSeeder::class, PartnerDemoSeeder::class, PartnershipApplicationDemoSeeder::class, UserDemoSeeder::class]);

    expect(Service::count())->toBe(20)
        ->and(ServicePackage::count())->toBe(60)
        ->and(Faq::count())->toBe(40)
        ->and(Article::count())->toBe(20)
        ->and(Partner::count())->toBe(20)
        ->and(PartnershipApplication::count())->toBe(20)
        ->and(User::count())->toBe(19);
});

test('public service pages render seeded content', function () {
    $this->get(route('services.index'))->assertOk();

    Service::query()->each(fn (Service $service) => $this->get(route('services.show', $service->slug))->assertOk());
});

test('admin index pages render the seeded data', function () {
    $this->actingAs(User::factory()->create());

    foreach (['admin.services.index', 'admin.categories.index', 'admin.articles.index', 'admin.partners.index', 'admin.partnership-applications.index', 'admin.users.index', 'admin.service-packages.index', 'admin.faqs.all'] as $routeName) {
        $this->get(route($routeName))->assertOk();
    }
});
