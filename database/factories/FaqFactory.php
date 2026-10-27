<?php

namespace Database\Factories;

use App\Models\Faq;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Faq>
 */
class FaqFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_id' => null,
            'question' => fake()->sentence(),
            'answer' => fake()->paragraph(),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 20),
        ];
    }

    public function forService(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_id' => Service::factory(),
        ]);
    }
}
