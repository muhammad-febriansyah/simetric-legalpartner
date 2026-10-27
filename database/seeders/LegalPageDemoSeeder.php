<?php

namespace Database\Seeders;

use App\Models\LegalPage;
use Illuminate\Database\Seeder;

class LegalPageDemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Kebijakan Privasi',
                'slug' => 'kebijakan-privasi',
                'sort_order' => 1,
                'content' => <<<'MARKDOWN'
## Informasi yang kami kumpulkan

LegalPartner.ID dapat menerima informasi yang Anda berikan saat mengisi formulir, meminta konsultasi, atau menghubungi tim kami. Informasi tersebut dapat mencakup nama, alamat email, nomor telepon, dan keterangan mengenai kebutuhan layanan.

## Penggunaan informasi

Informasi digunakan untuk menanggapi permintaan, menyiapkan layanan yang diminta, mengirim pembaruan terkait proses, menjaga keamanan layanan, serta memenuhi kewajiban hukum yang berlaku.

## Penyimpanan dan keamanan

Informasi disimpan selama diperlukan untuk tujuan layanan dan kewajiban pencatatan. Kami menerapkan langkah pengamanan yang wajar untuk mencegah akses, perubahan, atau pengungkapan tanpa izin.

## Hak Anda

Anda dapat meminta akses, koreksi, atau penghapusan informasi pribadi dengan menghubungi **[email privasi perlu dilengkapi]**. Permintaan dapat memerlukan verifikasi identitas.

## Catatan data demo

Naskah ini merupakan contoh awal. Lengkapi dasar pemrosesan, masa retensi, detail pengelola data, dan alamat kontak sebelum diterbitkan. Minta tinjauan penasihat hukum.
MARKDOWN,
            ],
            [
                'title' => 'Syarat & Ketentuan',
                'slug' => 'syarat-ketentuan',
                'sort_order' => 2,
                'content' => <<<'MARKDOWN'
## Ruang lingkup

Syarat ini mengatur penggunaan website LegalPartner.ID dan permintaan informasi atau layanan yang tersedia melalui website. Ketentuan khusus suatu layanan dapat diberikan dalam penawaran atau perjanjian terpisah.

## Penggunaan layanan

Pengguna wajib memberikan informasi yang benar, memiliki kewenangan untuk menyampaikan informasi tersebut, dan tidak menggunakan website untuk tujuan yang melanggar hukum.

## Biaya dan pelaksanaan

Ruang lingkup pekerjaan, biaya jasa, estimasi waktu, dan biaya pihak ketiga akan diinformasikan dalam penawaran atau konfirmasi tertulis. Proses dimulai setelah persyaratan yang disepakati dipenuhi.

## Batas tanggung jawab

Informasi pada website bersifat umum. Hasil dan waktu proses dapat dipengaruhi kelengkapan dokumen, keputusan instansi, dan keadaan di luar kendali kami. Ketentuan rinci perlu diatur dalam perjanjian layanan.

## Perubahan ketentuan

Ketentuan dapat diperbarui untuk menyesuaikan layanan atau peraturan. Versi dan tanggal efektif perlu dicantumkan saat dokumen ini diterbitkan.

## Catatan data demo

Contoh ini belum menjadi perjanjian yang mengikat. Isi identitas badan usaha, hukum yang berlaku, penyelesaian sengketa, dan tanggal efektif sebelum diterbitkan.
MARKDOWN,
            ],
            [
                'title' => 'Disclaimer',
                'slug' => 'disclaimer',
                'sort_order' => 3,
                'content' => <<<'MARKDOWN'
## Informasi umum

Materi di LegalPartner.ID disediakan untuk membantu memahami layanan legalitas dan perizinan secara umum. Materi website bukan pendapat hukum untuk keadaan tertentu dan tidak menggantikan konsultasi profesional.

## Hubungan profesional

Hubungan penasihat dan klien baru terbentuk setelah ruang lingkup pekerjaan disepakati dan dikonfirmasi secara tertulis oleh pihak terkait.

## Keakuratan informasi

Kami berupaya menjaga informasi tetap relevan, tetapi peraturan, kebijakan instansi, dan prosedur dapat berubah. Konfirmasikan persyaratan terbaru sebelum mengambil keputusan atau mengajukan permohonan.

## Tautan pihak ketiga

Website dapat memuat tautan ke layanan pihak ketiga. Kami tidak mengendalikan konten, ketersediaan, atau kebijakan privasi layanan tersebut.

## Catatan data demo

Naskah contoh ini perlu ditinjau agar sesuai dengan layanan dan batas tanggung jawab perusahaan.
MARKDOWN,
            ],
            [
                'title' => 'Kebijakan Cookie',
                'slug' => 'kebijakan-cookie',
                'sort_order' => 4,
                'content' => <<<'MARKDOWN'
## Apa itu cookie

Cookie adalah berkas kecil yang disimpan di perangkat ketika Anda mengunjungi website. Teknologi serupa dapat membantu website mengingat preferensi dan memahami penggunaan halaman.

## Cara kami menggunakannya

Website dapat menggunakan cookie yang diperlukan untuk fungsi dasar dan, bila diaktifkan, cookie analitik untuk memahami performa halaman. Daftar penyedia dan kategori cookie perlu diperbarui sesuai teknologi yang benar-benar digunakan.

## Pengaturan pilihan

Anda dapat menghapus atau membatasi cookie melalui pengaturan browser. Menonaktifkan cookie tertentu dapat memengaruhi fungsi website.

## Catatan data demo

Contoh ini belum mengonfirmasi penggunaan alat analitik, masa berlaku cookie, atau mekanisme persetujuan. Lengkapi informasi tersebut sebelum publikasi.
MARKDOWN,
            ],
            [
                'title' => 'Pembatalan & Pengembalian Dana',
                'slug' => 'pembatalan-pengembalian-dana',
                'sort_order' => 5,
                'content' => <<<'MARKDOWN'
## Permintaan pembatalan

Permintaan pembatalan disampaikan melalui kontak resmi dengan menyertakan nama pemesan, layanan, dan nomor konfirmasi. Tim akan mengonfirmasi status pekerjaan dan biaya yang sudah timbul.

## Pengembalian dana

Kelayakan dan jumlah pengembalian dana bergantung pada tahap pekerjaan, biaya pihak ketiga yang telah dibayarkan, serta kesepakatan dalam penawaran atau perjanjian layanan. Tidak ada pengembalian otomatis sebelum pemeriksaan tiap permintaan.

## Proses pengajuan

Hubungi **[email layanan perlu dilengkapi]**. Sertakan bukti pembayaran dan alasan permintaan. Estimasi waktu pemeriksaan dan metode pengembalian harus ditetapkan dalam kebijakan final.

## Catatan data demo

Ketentuan ini contoh awal. Tetapkan batas waktu pengajuan, kondisi pembatalan, biaya yang tidak dapat dikembalikan, dan jangka waktu pemrosesan sesuai praktik perusahaan.
MARKDOWN,
            ],
        ];

        foreach ($pages as $page) {
            LegalPage::query()->firstOrCreate(
                ['slug' => $page['slug']],
                [...$page, 'status' => 'draft', 'published_at' => null],
            );
        }
    }
}
