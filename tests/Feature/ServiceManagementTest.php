<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can update a service image with a spoofed put multipart request', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $category = ServiceCategory::factory()->create();
    $service = Service::factory()->for($category, 'category')->create();

    $this->actingAs($user)
        ->post(route('admin.services.update', $service), [
            '_method' => 'put',
            'service_category_id' => $category->id,
            'name' => $service->name,
            'slug' => $service->slug,
            'excerpt' => $service->excerpt,
            'description' => $service->description,
            'hero_image_file' => UploadedFile::fake()->image('service.png', 761, 564),
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => 0,
        ])
        ->assertRedirect(route('admin.services.edit', $service));

    $service->refresh();

    expect($service->hero_image)->toStartWith('services/');
    Storage::disk('public')->assertExists($service->hero_image);
});
