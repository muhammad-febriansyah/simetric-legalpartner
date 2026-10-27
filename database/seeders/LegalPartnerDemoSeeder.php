<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use Illuminate\Database\Seeder;

class LegalPartnerDemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoryDefinitions = [
            [
                'legacySlug' => 'kategori-demo-1',
                'slug' => 'pendirian-badan-usaha',
                'name' => 'Pendirian Badan Usaha',
                'description' => 'Contoh kategori untuk layanan pendirian dan persiapan badan usaha.',
            ],
            [
                'legacySlug' => 'kategori-demo-2',
                'slug' => 'perizinan-usaha',
                'name' => 'Perizinan Usaha',
                'description' => 'Contoh kategori untuk layanan izin dan administrasi usaha.',
            ],
            [
                'legacySlug' => 'kategori-demo-3',
                'slug' => 'kekayaan-intelektual',
                'name' => 'Kekayaan Intelektual',
                'description' => 'Contoh kategori untuk merek dan kekayaan intelektual.',
            ],
            [
                'legacySlug' => 'kategori-demo-4',
                'slug' => 'perpajakan',
                'name' => 'Perpajakan',
                'description' => 'Contoh kategori untuk administrasi dan konsultasi perpajakan.',
            ],
            [
                'legacySlug' => 'kategori-demo-5',
                'slug' => 'legal-korporasi',
                'name' => 'Legal Korporasi',
                'description' => 'Contoh kategori untuk kebutuhan legal korporasi.',
            ],
        ];

        $categories = [];

        foreach ($categoryDefinitions as $index => $definition) {
            $category = ServiceCategory::query()->where('slug', $definition['legacySlug'])->first();

            if ($category === null) {
                $category = ServiceCategory::query()->firstOrNew(['slug' => $definition['slug']]);
            }

            $category->fill([
                'slug' => $definition['slug'],
                'name' => $definition['name'],
                'description' => $definition['description'],
                'sort_order' => $index + 1,
                'is_active' => true,
            ])->save();
            $categories[] = $category;
        }

        $legacyService = Service::query()->where('slug', 'layanan-demo')->first();

        if ($legacyService !== null && ! Service::query()->where('slug', 'pendirian-pt')->exists()) {
            $legacyService->update(['slug' => 'pendirian-pt']);
        }

        $service = Service::query()->updateOrCreate(
            ['slug' => 'pendirian-pt'],
            [
                'service_category_id' => $categories[0]->id,
                'name' => 'Pendirian Perseroan Terbatas (PT)',
                'excerpt' => 'Contoh pendampingan persiapan pendirian PT untuk menguji katalog dan pilihan paket.',
                'description' => 'Data simulasi untuk pengembangan LegalPartner.ID. Informasi layanan, cakupan, waktu, dan harga pada halaman ini bukan penawaran resmi dan harus diverifikasi sebelum dipublikasikan.',
                'requirements' => [
                    'Data identitas para pendiri dan pengurus.',
                    'Pilihan nama dan gambaran kegiatan usaha.',
                    'Alamat domisili serta informasi pendukung sesuai kebutuhan.',
                ],
                'process_steps' => [
                    'Konsultasi awal untuk memetakan kebutuhan usaha.',
                    'Pemeriksaan kelengkapan data dan dokumen.',
                    'Penyusunan rencana pendampingan dan konfirmasi ruang lingkup.',
                ],
                'duration_label' => 'Contoh estimasi: 7–14 hari kerja',
                'meta_title' => 'Contoh Layanan Pendirian PT | LegalPartner.ID',
                'meta_description' => 'Data simulasi layanan dan paket pendirian PT untuk pratinjau LegalPartner.ID.',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
            ],
        );

        ServicePackage::query()
            ->where('service_id', $service->id)
            ->whereIn('slug', ['paket-demo-a', 'paket-demo-b'])
            ->delete();

        foreach ([
            [
                'name' => 'Konsultasi & Persiapan',
                'slug' => 'konsultasi-persiapan',
                'description' => 'SIMULASI DEMO — contoh cakupan dan harga; konfirmasi ruang lingkup sebelum publikasi.',
                'price' => 1_500_000,
                'features' => [
                    'Konsultasi kebutuhan awal usaha.',
                    'Checklist data dan dokumen persiapan.',
                    'Ringkasan tahapan pendampingan.',
                ],
                'is_popular' => false,
            ],
            [
                'name' => 'Pendampingan Pendirian',
                'slug' => 'pendampingan-pendirian',
                'description' => 'SIMULASI DEMO — contoh paket utama; detail layanan dan biaya wajib diverifikasi.',
                'price' => 4_500_000,
                'features' => [
                    'Konsultasi dan pemetaan kebutuhan.',
                    'Pemeriksaan kelengkapan data pendiri.',
                    'Pendampingan persiapan dokumen.',
                    'Checklist tindak lanjut setelah proses.',
                ],
                'is_popular' => true,
            ],
            [
                'name' => 'Pendampingan Plus',
                'slug' => 'pendampingan-plus',
                'description' => 'SIMULASI DEMO — contoh cakupan lebih luas; bukan penawaran harga resmi.',
                'price' => 7_500_000,
                'features' => [
                    'Seluruh fasilitas Pendampingan Pendirian.',
                    'Sesi konsultasi lanjutan untuk kebutuhan operasional.',
                    'Checklist administrasi pasca pendirian.',
                    'Ringkasan dokumen dan langkah tindak lanjut.',
                ],
                'is_popular' => false,
            ],
        ] as $sortOrder => $package) {
            ServicePackage::query()->updateOrCreate(
                ['service_id' => $service->id, 'slug' => $package['slug']],
                [
                    'name' => $package['name'],
                    'description' => $package['description'],
                    'price' => $package['price'],
                    'price_label' => null,
                    'features' => $package['features'],
                    'is_active' => true,
                    'is_popular' => $package['is_popular'],
                    'sort_order' => $sortOrder + 1,
                ],
            );
        }

    }
}
