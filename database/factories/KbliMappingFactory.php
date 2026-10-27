<?php

namespace Database\Factories;

use App\Models\KbliCode;
use App\Models\KbliMapping;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KbliMapping>
 */
class KbliMappingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'source_kbli_id' => KbliCode::factory()->state(['version' => 2020]),
            'target_kbli_id' => KbliCode::factory()->state(['version' => 2025]),
            'relation_type' => fake()->randomElement(['equivalent', 'split', 'merged']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
