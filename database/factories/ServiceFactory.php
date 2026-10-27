<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'service_category_id' => ServiceCategory::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'excerpt' => fake()->sentence(),
            'description' => fake()->paragraphs(3, true),
            'hero_image' => null,
            'hero_image_alt' => null,
            'requirements' => [],
            'process_steps' => [],
            'duration_label' => fake()->optional()->randomElement(['3–5 hari kerja', '1–2 minggu']),
            'meta_title' => null,
            'meta_description' => null,
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }
}
