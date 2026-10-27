<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('public pages share active categories with active services for the mega menu', function () {
    $category = ServiceCategory::factory()->create(['name' => 'Pendirian Badan Usaha', 'is_active' => true, 'sort_order' => 1]);
    ServiceCategory::factory()->create(['is_active' => false]);
    Service::factory()->for($category, 'category')->create(['name' => 'Pendirian PT', 'is_active' => true, 'is_featured' => true]);
    Service::factory()->for($category, 'category')->create(['name' => 'Layanan Nonaktif', 'is_active' => false]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('serviceMenu', 1)
            ->where('serviceMenu.0.name', 'Pendirian Badan Usaha')
            ->has('serviceMenu.0.services', 1)
            ->where('serviceMenu.0.services.0.name', 'Pendirian PT')
            ->where('serviceMenu.0.services.0.isFeatured', true));
});

test('admin pages do not load the mega menu', function () {
    ServiceCategory::factory()->create(['is_active' => true]);

    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('serviceMenu', []));
});
