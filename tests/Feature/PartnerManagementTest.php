<?php

use App\Models\Partner;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot open partner management', function () {
    $this->get(route('admin.partners.index'))
        ->assertRedirect(route('login'));
});

test('admin can search partners and see image previews', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $partner = Partner::factory()->create([
        'name' => 'PusatRilis Indonesia',
        'image_path' => UploadedFile::fake()->image('pusat-rilis.png')->store('partners', 'public'),
    ]);
    Partner::factory()->create(['name' => 'Naremax']);

    $this->actingAs($user)
        ->get(route('admin.partners.index', ['search' => 'pusat']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/partners/index')
            ->where('search', 'pusat')
            ->where('partners.total', 1)
            ->where('partners.data.0.name', 'PusatRilis Indonesia')
            ->where('partners.data.0.imageUrl', Storage::disk('public')->url($partner->image_path)),
        );
});

test('admin can create partner with uploaded image', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $image = UploadedFile::fake()->image('partner.png', 480, 240);

    $this->actingAs($user)
        ->post(route('admin.partners.store'), [
            'name' => 'Naremax',
            'image' => $image,
        ])
        ->assertRedirect(route('admin.partners.index'));

    $partner = Partner::query()->where('name', 'Naremax')->firstOrFail();

    expect($partner->image_path)->toStartWith('partners/');
    Storage::disk('public')->assertExists($partner->image_path);
});

test('admin can rename partner without replacing its image', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $imagePath = UploadedFile::fake()->image('partner.png')->store('partners', 'public');
    $partner = Partner::factory()->create(['image_path' => $imagePath]);

    $this->actingAs($user)
        ->put(route('admin.partners.update', $partner), ['name' => 'Mitra Legal Baru'])
        ->assertRedirect(route('admin.partners.index'));

    $this->assertDatabaseHas('partners', [
        'id' => $partner->id,
        'name' => 'Mitra Legal Baru',
        'image_path' => $imagePath,
    ]);
    Storage::disk('public')->assertExists($imagePath);
});

test('admin can replace partner image and old file is removed', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $oldImagePath = UploadedFile::fake()->image('old.png')->store('partners', 'public');
    $partner = Partner::factory()->create(['image_path' => $oldImagePath]);

    $this->actingAs($user)
        ->put(route('admin.partners.update', $partner), [
            'name' => $partner->name,
            'image' => UploadedFile::fake()->image('new.webp'),
        ])
        ->assertRedirect(route('admin.partners.index'));

    $partner->refresh();

    expect($partner->image_path)->not->toBe($oldImagePath);
    Storage::disk('public')->assertMissing($oldImagePath);
    Storage::disk('public')->assertExists($partner->image_path);
});

test('admin can delete partner and its image', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $imagePath = UploadedFile::fake()->image('partner.png')->store('partners', 'public');
    $partner = Partner::factory()->create(['image_path' => $imagePath]);

    $this->actingAs($user)
        ->delete(route('admin.partners.destroy', $partner))
        ->assertRedirect(route('admin.partners.index'));

    $this->assertModelMissing($partner);
    Storage::disk('public')->assertMissing($imagePath);
});

test('partner name and image are required when creating', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('admin.partners.index'))
        ->post(route('admin.partners.store'), ['name' => ''])
        ->assertRedirect(route('admin.partners.index'))
        ->assertSessionHasErrors(['name', 'image']);

    expect(Partner::query()->count())->toBe(0);
});
