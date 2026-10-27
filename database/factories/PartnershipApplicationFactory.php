<?php

namespace Database\Factories;

use App\Models\PartnershipApplication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PartnershipApplication>
 */
class PartnershipApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'whatsapp' => fake()->numerify('08##########'),
            'email' => fake()->optional()->safeEmail(),
            'partnership_type' => fake()->randomElement(array_keys(PartnershipApplication::TYPES)),
            'message' => fake()->optional()->paragraph(),
            'status' => PartnershipApplication::STATUS_NEW,
            'admin_notes' => null,
        ];
    }
}
