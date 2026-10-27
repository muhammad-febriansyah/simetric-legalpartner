<?php

use App\Models\LegalPage;
use App\Models\Service;
use App\Models\ServiceCategory;
use Inertia\Testing\AssertableInertia as Assert;

test('published legal page renders and draft returns not found', function () {
    $published = LegalPage::factory()->create(['slug' => 'kebijakan-privasi', 'status' => 'published']);
    $draft = LegalPage::factory()->create(['slug' => 'disclaimer', 'status' => 'draft']);

    $this->get(route('legal.show', $published->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('public/legal')->where('page.slug', 'kebijakan-privasi'));

    $this->get(route('legal.show', $draft->slug))->assertNotFound();
});

test('public pages share footer data with published legal pages and top services', function () {
    LegalPage::factory()->create(['slug' => 'kebijakan-privasi', 'title' => 'Kebijakan Privasi', 'status' => 'published', 'sort_order' => 1]);
    LegalPage::factory()->create(['slug' => 'disclaimer', 'status' => 'draft']);
    $category = ServiceCategory::factory()->create(['is_active' => true]);
    Service::factory()->for($category, 'category')->create(['name' => 'Pendirian PT', 'is_active' => true]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('siteFooter.legalPages', 1)
            ->where('siteFooter.legalPages.0.slug', 'kebijakan-privasi')
            ->has('siteFooter.topServices', 1)
            ->where('siteFooter.name', 'LegalPartner.ID'));
});
