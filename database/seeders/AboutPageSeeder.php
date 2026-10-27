<?php

namespace Database\Seeders;

use App\Models\AboutPage;
use Database\Seeders\Concerns\CopiesDemoAssets;
use Illuminate\Database\Seeder;

class AboutPageSeeder extends Seeder
{
    use CopiesDemoAssets;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aboutPage = AboutPage::query()->firstOrCreate(
            ['id' => 1],
            AboutPage::factory()->raw([
                'title' => 'Partner Legalitas untuk Pertumbuhan Usaha',
                'subtitle' => 'LegalPartner.ID membantu pelaku usaha memahami dan mengurus kebutuhan legalitas dengan proses yang jelas dan pendampingan yang responsif.',
                'content' => <<<'MARKDOWN'
## Mengenal LegalPartner.ID

LegalPartner.ID adalah layanan pendampingan legalitas usaha dari Simetric Consulting Group. Kami membantu calon pelaku usaha dan perusahaan memahami pilihan layanan, menyiapkan kebutuhan administrasi, serta mengikuti proses yang disepakati bersama.

Kami percaya urusan legalitas seharusnya terasa lebih mudah dipahami. Karena itu, setiap kebutuhan diawali dengan penjelasan ruang lingkup, dokumen yang diperlukan, dan tahapan yang akan dijalankan.

## Visi

Menjadi mitra tepercaya yang membantu pelaku usaha membangun fondasi legalitas yang tertata agar dapat fokus mengembangkan bisnis.

## Misi

- Menyajikan informasi legalitas usaha dengan bahasa yang jelas dan mudah dipahami.
- Mendampingi klien menyiapkan dokumen sesuai ruang lingkup layanan.
- Menyampaikan tahapan, kebutuhan, dan biaya secara transparan sebelum pekerjaan dimulai.
- Memberikan pembaruan proses melalui komunikasi yang responsif.

## Nilai kerja

### Transparan

Ruang lingkup, biaya, dan estimasi proses dijelaskan sebelum layanan berjalan.

### Bertanggung jawab

Setiap permintaan ditangani sesuai kesepakatan dan informasi yang tersedia.

### Kolaboratif

Kami berkoordinasi dengan klien dan pihak terkait agar kebutuhan administrasi lebih terarah.

### Menjaga kepercayaan

Informasi yang diberikan klien digunakan untuk keperluan komunikasi dan layanan sesuai ketentuan yang berlaku.

## Pendampingan yang disesuaikan

Kebutuhan tiap usaha berbeda. Tim LegalPartner.ID membantu memahami pilihan layanan seperti pendirian badan usaha, perizinan, dan pendaftaran merek, lalu menjelaskan langkah berikutnya berdasarkan kebutuhan Anda.

## Mari diskusikan kebutuhan usaha Anda

Hubungi tim kami untuk konsultasi awal dan dapatkan gambaran layanan yang sesuai.
MARKDOWN,
                'status' => 'published',
                'published_at' => now(),
            ]),
        );

        $aboutPage->fill([
            'banner_image_path' => $this->publishDemoAsset('about/about-banner.jpg', 'about'),
            'vision' => $aboutPage->vision ?? 'Menjadi mitra tepercaya yang membantu pelaku usaha membangun fondasi legalitas yang tertata agar dapat fokus mengembangkan bisnis.',
            'mission' => $aboutPage->mission ?? <<<'MARKDOWN'
- Menyajikan informasi legalitas usaha dengan bahasa yang jelas dan mudah dipahami.
- Mendampingi klien menyiapkan dokumen sesuai ruang lingkup layanan.
- Menyampaikan tahapan, kebutuhan, dan biaya secara transparan sebelum pekerjaan dimulai.
- Memberikan pembaruan proses melalui komunikasi yang responsif.
MARKDOWN,
            'process' => $aboutPage->process ?? <<<'MARKDOWN'
1. **Konsultasi kebutuhan** — Kami memahami rencana dan kebutuhan usaha Anda.
2. **Tentukan ruang lingkup** — Tim menjelaskan layanan, dokumen, biaya, dan estimasi proses.
3. **Persiapan dokumen** — Anda menyiapkan data yang dibutuhkan dengan panduan tim.
4. **Pengurusan dan pembaruan** — Tim menjalankan proses dan menyampaikan perkembangannya.
5. **Serah terima** — Hasil disampaikan dan tim menjelaskan tindak lanjut yang diperlukan.
MARKDOWN,
            'features' => $aboutPage->features ?? <<<'MARKDOWN'
- **Konsultasi terarah** untuk membantu memilih kebutuhan legalitas usaha.
- **Pendampingan personal** dari persiapan dokumen hingga proses selesai.
- **Informasi transparan** mengenai ruang lingkup, tahapan, dan biaya.
- **Pembaruan responsif** agar Anda mengetahui perkembangan pengurusan.
MARKDOWN,
        ]);

        $profileContent = preg_replace('/\n## Visi\n\n.*?(?=\n## Nilai kerja)/s', '', $aboutPage->content);

        if ($profileContent !== null && $profileContent !== $aboutPage->content) {
            $aboutPage->content = $profileContent;
        }

        if ($aboutPage->isDirty()) {
            $aboutPage->save();
        }
    }
}
