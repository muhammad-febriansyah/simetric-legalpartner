<?php

use App\Models\Article;
use App\Models\Faq;
use App\Models\Partner;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use Inertia\Testing\AssertableInertia;

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('homepage shares real catalog, partner, article, and faq data', function () {
    $category = ServiceCategory::factory()->create(['is_active' => true]);
    $service = Service::factory()->for($category, 'category')->create(['is_active' => true, 'is_featured' => true]);
    ServicePackage::factory()->create(['service_id' => $service->id, 'is_active' => true, 'is_popular' => true, 'price' => 2_000_000]);
    Faq::factory()->create(['service_id' => $service->id, 'is_active' => true]);
    Partner::factory()->create();
    Article::factory()->published()->count(4)->create();
    Article::factory()->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('public/home')
            ->has('featured', 1)
            ->where('featured.0.popularPackage.price', 2000000)
            ->has('categories', 1)
            ->has('partners', 1)
            ->has('articles', 3)
            ->has('faqs', 1)
            ->where('stats.services', 1)
            ->where('stats.articles', 4));
});
