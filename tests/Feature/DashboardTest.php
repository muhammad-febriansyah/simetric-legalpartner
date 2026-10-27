<?php

use App\Models\Article;
use App\Models\Faq;
use App\Models\Partner;
use App\Models\PartnershipApplication;
use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard summarizes actual catalog data and recent activity', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $service = Service::factory()->create(['is_active' => true]);
    Service::factory()->create([
        'is_active' => false,
        'created_at' => now()->subDay(),
        'updated_at' => now()->subDay(),
    ]);
    ServicePackage::factory()->create(['service_id' => $service->id, 'is_active' => true]);
    ServicePackage::factory()->create(['service_id' => $service->id, 'is_active' => false]);
    Article::factory()->published()->create();
    Article::factory()->create(['status' => 'draft']);
    Faq::factory()->create(['service_id' => $service->id]);
    Partner::factory()->create();
    PartnershipApplication::factory()->create();

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('stats.activeServices', 1)
            ->where('stats.totalServices', 2)
            ->where('stats.activePackages', 1)
            ->where('stats.totalPackages', 2)
            ->where('stats.publishedArticles', 1)
            ->where('stats.draftArticles', 1)
            ->where('stats.totalCategories', 2)
            ->where('stats.totalFaqs', 1)
            ->where('stats.totalPartners', 1)
            ->where('stats.newPartnershipApplications', 1)
            ->has('charts.activity.labels', 6)
            ->where('charts.activity.series.0.data.5', 2)
            ->where('charts.activity.series.1.data.5', 2)
            ->where('charts.activity.series.2.data.5', 1)
            ->where('charts.content.series', [2, 2, 2, 1, 2, 1])
            ->where('recentServices.0.name', $service->name)
        );
});
