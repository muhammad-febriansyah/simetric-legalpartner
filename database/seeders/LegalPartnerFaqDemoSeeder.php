<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\Service;
use Illuminate\Database\Seeder;

class LegalPartnerFaqDemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $service = Service::query()->where('slug', 'pendirian-pt')->first();

        if ($service === null) {
            return;
        }

        foreach ([
            [
                'question' => 'Dokumen apa yang perlu disiapkan untuk pendirian PT?',
                'answer' => 'Sebagai persiapan awal, siapkan data identitas pendiri dan pengurus, pilihan nama, gambaran kegiatan usaha, serta informasi alamat usaha. Daftar final menyesuaikan kebutuhan dan hasil konsultasi. Data FAQ ini merupakan simulasi dan perlu diverifikasi sebelum dipublikasikan.',
            ],
            [
                'question' => 'Berapa lama proses pendirian PT?',
                'answer' => 'Waktu pengerjaan bergantung pada kelengkapan dokumen, kebutuhan usaha, dan proses instansi terkait. Tim akan mengonfirmasi estimasi setelah meninjau kebutuhan. Informasi ini merupakan data simulasi, bukan jaminan waktu penyelesaian.',
            ],
            [
                'question' => 'Apakah harga paket sudah termasuk seluruh biaya?',
                'answer' => 'Rincian biaya layanan dan biaya pihak ketiga perlu dikonfirmasi sesuai ruang lingkup yang disepakati. Silakan konsultasikan kebutuhan agar komponen biaya dapat dijelaskan sebelum layanan dimulai. Harga pada paket ini merupakan simulasi.',
            ],
            [
                'question' => 'Bisakah konsultasi sebelum memilih paket?',
                'answer' => 'Bisa. Hubungi tim LegalPartner.ID melalui tombol konsultasi untuk menjelaskan kebutuhan usaha terlebih dahulu. Tim dapat membantu mengarahkan pilihan layanan dan paket yang sesuai.',
            ],
        ] as $sortOrder => $faq) {
            Faq::query()->updateOrCreate(
                ['service_id' => $service->id, 'question' => $faq['question']],
                [
                    'answer' => $faq['answer'],
                    'is_active' => true,
                    'sort_order' => $sortOrder + 1,
                ],
            );
        }
    }
}
