<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot open category management', function () {
    $this->get(route('admin.categories.index'))
        ->assertRedirect(route('login'));
});

test('admin can search categories by name and see service counts', function () {
    $user = User::factory()->create();
    $category = ServiceCategory::factory()->create([
        'name' => 'Pendirian Badan Usaha',
        'slug' => 'pendirian-badan-usaha',
    ]);
    Service::factory()->for($category, 'category')->create();
    ServiceCategory::factory()->create(['name' => 'Perpajakan', 'slug' => 'perpajakan']);

    $this->actingAs($user)
        ->get(route('admin.categories.index', ['search' => 'pendirian']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/categories/index')
            ->where('search', 'pendirian')
            ->where('categories.total', 1)
            ->where('categories.data.0.name', 'Pendirian Badan Usaha')
            ->where('categories.data.0.serviceCount', 1),
        );
});

test('admin can create a category with an automatically generated unique slug', function () {
    $user = User::factory()->create();
    ServiceCategory::factory()->create([
        'name' => 'Pendirian Badan Usaha',
        'slug' => 'pendirian-badan-usaha',
    ]);

    $this->actingAs($user)
        ->post(route('admin.categories.store'), [
            'name' => 'Pendirian Badan Usaha',
            'description' => 'Kategori untuk pendirian usaha.',
            'icon' => 'building',
            'sort_order' => 2,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.categories.index'));

    $this->assertDatabaseHas('service_categories', [
        'name' => 'Pendirian Badan Usaha',
        'slug' => 'pendirian-badan-usaha-2',
        'description' => 'Kategori untuk pendirian usaha.',
        'icon' => 'building',
    ]);
});

test('admin can update category details and the slug follows its name', function () {
    $user = User::factory()->create();
    $category = ServiceCategory::factory()->create([
        'name' => 'Kategori Lama',
        'slug' => 'kategori-lama',
    ]);

    $this->actingAs($user)
        ->put(route('admin.categories.update', $category), [
            'name' => 'Perizinan Usaha',
            'description' => 'Izin dan administrasi usaha.',
            'icon' => 'briefcase',
            'sort_order' => 3,
            'is_active' => false,
        ])
        ->assertRedirect(route('admin.categories.index'));

    $this->assertDatabaseHas('service_categories', [
        'id' => $category->id,
        'name' => 'Perizinan Usaha',
        'slug' => 'perizinan-usaha',
        'sort_order' => 3,
        'is_active' => false,
    ]);
});

test('admin cannot delete a category that has services', function () {
    $user = User::factory()->create();
    $category = ServiceCategory::factory()->create();
    Service::factory()->for($category, 'category')->create();

    $this->actingAs($user)
        ->from(route('admin.categories.index'))
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect(route('admin.categories.index'))
        ->assertSessionHasErrors('category');

    $this->assertModelExists($category);
});

test('admin can delete an unused category', function () {
    $user = User::factory()->create();
    $category = ServiceCategory::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect(route('admin.categories.index'));

    $this->assertModelMissing($category);
});

test('category name is required', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('admin.categories.index'))
        ->post(route('admin.categories.store'), [
            'name' => '',
            'sort_order' => 0,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.categories.index'))
        ->assertSessionHasErrors('name');

    expect(ServiceCategory::query()->count())->toBe(0);
});
