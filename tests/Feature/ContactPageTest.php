<?php

use App\Models\AboutPage;
use App\Models\SiteSetting;
use Inertia\Testing\AssertableInertia as Assert;

test('contact page exposes channels from website settings', function () {
    SiteSetting::query()->create(['key' => 'contact_email', 'value' => 'halo@legalpartner.id']);
    SiteSetting::query()->create(['key' => 'whatsapp_number', 'value' => '+62 812-5550-0100']);
    SiteSetting::query()->create(['key' => 'contact_address', 'value' => 'Jl. Wijaya II No. 18, Jakarta Selatan']);

    $this->get(route('contact.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/contact')
            ->where('contact.email', 'halo@legalpartner.id')
            ->where('contact.whatsapp', '6281255500100')
            ->where('contact.address', 'Jl. Wijaya II No. 18, Jakarta Selatan')
            ->where('contact.phone', null)
            ->where('contact.mapsEmbedUrl', null));
});

test('contact page only embeds google maps urls', function () {
    SiteSetting::query()->create(['key' => 'google_maps_embed_url', 'value' => 'https://evil.example/phish']);

    $this->get(route('contact.show'))
        ->assertInertia(fn (Assert $page) => $page->where('contact.mapsEmbedUrl', null));

    SiteSetting::query()->where('key', 'google_maps_embed_url')->update(['value' => 'https://www.google.com/maps?q=Jakarta&output=embed']);

    $this->get(route('contact.show'))
        ->assertInertia(fn (Assert $page) => $page->where('contact.mapsEmbedUrl', 'https://www.google.com/maps?q=Jakarta&output=embed'));
});

test('about page includes catalog counts', function () {
    AboutPage::factory()->create(['id' => 1, 'status' => 'published']);

    $this->get(route('about.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('public/about')->has('stats.services'));
});
