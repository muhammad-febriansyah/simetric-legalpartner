<?php

namespace Database\Factories;

use App\Models\AboutPage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AboutPage>
 */
class AboutPageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(5),
            'subtitle' => fake()->sentence(),
            'content' => fake()->paragraphs(4, true),
            'banner_image_path' => '/images/legalpartner-about-banner.svg',
            'vision' => 'Menjadi mitra tepercaya untuk fondasi legalitas usaha yang kuat.',
            'mission' => '- Menjelaskan proses dengan bahasa yang mudah dipahami.\n- Mendampingi kebutuhan legalitas secara transparan.',
            'process' => "1. Konsultasi kebutuhan dan ruang lingkup.\n2. Persiapan dokumen bersama klien.\n3. Pengurusan dan pembaruan proses.\n4. Penyerahan hasil dan tindak lanjut.",
            'features' => '- Konsultasi kebutuhan usaha.\n- Pendampingan dokumen dan proses.\n- Pembaruan status secara responsif.\n- Ruang lingkup dan biaya dijelaskan di awal.',
            'status' => 'draft',
            'published_at' => null,
        ];
    }
}
