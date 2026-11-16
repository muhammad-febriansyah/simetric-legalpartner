<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\SiteSetting;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can save whatsapp message templates', function () {
    $this->actingAs(User::factory()->create())
        ->put(route('admin.settings.website.update'), [
            'site_name' => 'LegalPartner.ID',
            'whatsapp_consult_message' => 'Halo, saya mau konsultasi.',
            'whatsapp_service_message' => 'Halo, saya tertarik {layanan} paket {paket} ({harga}).',
        ])
        ->assertSessionHasNoErrors();

    expect(SiteSetting::query()->where('key', 'whatsapp_consult_message')->value('value'))->toBe('Halo, saya mau konsultasi.')
        ->and(SiteSetting::query()->where('key', 'whatsapp_service_message')->value('value'))->toBe('Halo, saya tertarik {layanan} paket {paket} ({harga}).');
});

test('templates longer than 1000 characters are rejected', function () {
    $this->actingAs(User::factory()->create())
        ->put(route('admin.settings.website.update'), [
            'site_name' => 'LegalPartner.ID',
            'whatsapp_consult_message' => str_repeat('a', 1001),
        ])
        ->assertSessionHasErrors('whatsapp_consult_message');
});

test('public pages receive the saved templates', function () {
    SiteSetting::query()->create(['key' => 'whatsapp_consult_message', 'value' => 'Halo, saya mau konsultasi.']);
    SiteSetting::query()->create(['key' => 'whatsapp_service_message', 'value' => 'Tertarik {layanan}']);
    $service = Service::factory()
        ->for(ServiceCategory::factory()->create(['is_active' => true]), 'category')
        ->create(['is_active' => true]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page->where('siteContact.consultMessage', 'Halo, saya mau konsultasi.'));

    $this->get(route('services.show', $service->slug))
        ->assertInertia(fn (Assert $page) => $page->where('whatsappMessageTemplate', 'Tertarik {layanan}'));
});
