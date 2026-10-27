<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServiceAddon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceAddon>
 */
class ServiceAddonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->optional()->sentence(),
            'price' => fake()->numberBetween(100_000, 5_000_000),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 20),
        ];
    }
}
