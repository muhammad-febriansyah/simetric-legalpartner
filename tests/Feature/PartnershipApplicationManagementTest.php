<?php

use App\Models\PartnershipApplication;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('public visitor can view the partnership page and submit an application', function () {
    $this->get(route('partnership.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/partnership')
            ->where('partnershipTypes.notaris-ppat', 'Notaris & PPAT')
            ->where('partnershipTypes.virtual-office', 'Virtual office'),
        );

    $this->post(route('partnership.store'), [
        'full_name' => 'Budi Santoso',
        'whatsapp' => '081234567890',
        'email' => 'budi@example.com',
        'partnership_type' => 'notaris-ppat',
        'message' => 'Saya ingin membahas kerja sama notaris di Jakarta.',
    ])->assertRedirect();

    $this->assertDatabaseHas('partnership_applications', [
        'full_name' => 'Budi Santoso',
        'whatsapp' => '081234567890',
        'email' => 'budi@example.com',
        'partnership_type' => 'notaris-ppat',
        'status' => PartnershipApplication::STATUS_NEW,
    ]);
});

test('partnership application requires valid contact details and category', function () {
    $this->from(route('partnership.index'))
        ->post(route('partnership.store'), [
            'full_name' => '',
            'whatsapp' => 'abc',
            'email' => 'not-an-email',
            'partnership_type' => 'unknown',
        ])
        ->assertRedirect(route('partnership.index'))
        ->assertSessionHasErrors(['full_name', 'whatsapp', 'email', 'partnership_type']);

    expect(PartnershipApplication::query()->count())->toBe(0);
});

test('guests cannot open partnership application management', function () {
    $this->get(route('admin.partnership-applications.index'))
        ->assertRedirect(route('login'));
});

test('admin can filter applications and update follow-up status and notes', function () {
    $admin = User::factory()->create();
    $application = PartnershipApplication::factory()->create([
        'full_name' => 'Budi Santoso',
        'partnership_type' => 'notaris-ppat',
    ]);
    PartnershipApplication::factory()->create([
        'full_name' => 'Siti Rahma',
        'partnership_type' => 'virtual-office',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.partnership-applications.index', [
            'search' => 'Budi',
            'type' => 'notaris-ppat',
            'status' => PartnershipApplication::STATUS_NEW,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/partnership-applications/index')
            ->where('applications.total', 1)
            ->where('applications.data.0.fullName', 'Budi Santoso')
            ->where('filters.type', 'notaris-ppat'),
        );

    $this->put(route('admin.partnership-applications.update', $application), [
        'status' => PartnershipApplication::STATUS_CONTACTED,
        'admin_notes' => 'Sudah dihubungi, jadwalkan diskusi minggu depan.',
    ])->assertRedirect();

    $this->assertDatabaseHas('partnership_applications', [
        'id' => $application->id,
        'status' => PartnershipApplication::STATUS_CONTACTED,
        'admin_notes' => 'Sudah dihubungi, jadwalkan diskusi minggu depan.',
    ]);
});

test('admin cannot save unsupported partnership application status', function () {
    $admin = User::factory()->create();
    $application = PartnershipApplication::factory()->create();

    $this->actingAs($admin)
        ->from(route('admin.partnership-applications.index'))
        ->put(route('admin.partnership-applications.update', $application), [
            'status' => 'unknown',
            'admin_notes' => 'Check this',
        ])
        ->assertRedirect(route('admin.partnership-applications.index'))
        ->assertSessionHasErrors(['status']);

    expect($application->fresh()->status)->toBe(PartnershipApplication::STATUS_NEW);
});
