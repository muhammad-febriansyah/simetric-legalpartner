<?php

namespace Database\Factories;

use App\Models\KbliCode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KbliCode>
 */
class KbliCodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'version' => 2025,
            'code' => fake()->unique()->numerify('#####'),
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'parent_code' => null,
            'search_keywords' => fake()->optional()->words(4, true),
        ];
    }
}
