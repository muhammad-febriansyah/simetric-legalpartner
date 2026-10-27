<?php

namespace Database\Seeders;

use App\Models\PartnershipApplication;
use Illuminate\Database\Seeder;

class PartnershipApplicationDemoSeeder extends Seeder
{
    /**
     * Seed partnership applications spread over the last month.
     */
    public function run(): void
    {
        $applications = [
            ['Hendra Wijaya, S.H., M.Kn.', '081211223344', 'hendra.wijaya@notarishendra.co.id', 'notaris-ppat', 'Kami kantor notaris di Tangerang Selatan dan ingin menjadi notaris rekanan untuk pendirian PT dan perubahan akta.', 'in_review', 2],
            ['Putri Maharani', '081398765432', 'putri.maharani@gmail.com', 'agen-reseller', 'Saya punya komunitas UMKM di Bandung dan ingin merekomendasikan layanan legalitas dengan skema referral.', 'new', 1],
            ['PT Ruang Kerja Nusantara', '082122334455', 'kerjasama@ruangkerjanusantara.id', 'virtual-office', 'Kami pengelola virtual office di Jakarta Selatan dan ingin menawarkan alamat untuk klien pendirian PT Anda.', 'contacted', 3],
            ['Agus Setiawan, S.H.', '085711122233', 'agus.setiawan@ppatagus.com', 'notaris-ppat', 'PPAT di Bekasi, tertarik bekerja sama untuk layanan balik nama dan pengecekan sertifikat.', 'approved', 5],
            ['Dewi Lestari', '081234567801', 'dewi.lestari@outlook.com', 'agen-reseller', 'Konsultan keuangan freelance, ingin menjadi agen untuk klien yang membutuhkan pendirian usaha.', 'new', 0],
            ['Kantor Notaris Siti Aminah', '081255577788', 'admin@notarissitiaminah.id', 'notaris-ppat', 'Kami melayani wilayah Surabaya dan ingin tahu syarat menjadi rekanan.', 'contacted', 6],
            ['Bayu Prakoso', '081345678900', 'bayu.prakoso@gmail.com', 'agen-reseller', 'Pemilik toko online, banyak seller yang bertanya soal izin dan merek.', 'in_review', 4],
            ['Gedung Graha Mulia', '021-55501234', 'marketing@grahamulia.co.id', 'virtual-office', 'Gedung perkantoran di Kuningan menyediakan paket virtual office dengan legalitas lengkap.', 'rejected', 8],
            ['Rina Kartika, S.H.', '081277788899', 'rina.kartika@gmail.com', 'notaris-ppat', 'Notaris baru di Yogyakarta, ingin membangun jaringan rekanan.', 'new', 1],
            ['Fajar Nugroho', '082233344455', 'fajar.nugroho@fajarconsulting.id', 'agen-reseller', 'Konsultan bisnis yang mendampingi startup, ingin kerja sama referral.', 'approved', 10],
            ['Coworking Space Bintang', '081311100022', 'halo@bintangcowork.com', 'virtual-office', 'Coworking di Semarang ingin menawarkan alamat dan ruang meeting.', 'contacted', 7],
            ['Yusuf Hakim, S.H., M.Kn.', '081288899900', 'yusuf.hakim@notarisyusuf.com', 'notaris-ppat', 'Notaris dan PPAT di Medan, tertarik untuk kerja sama penanganan perubahan akta.', 'in_review', 9],
            ['Maya Anggraini', '085266677788', 'maya.anggraini@gmail.com', 'agen-reseller', 'Founder komunitas perempuan pengusaha di Malang, ingin mengadakan webinar legalitas.', 'new', 2],
            ['PT Menara Niaga Bersama', '021-29901122', 'leasing@menaraniaga.co.id', 'virtual-office', 'Pengelola gedung di Sudirman, menyediakan alamat virtual untuk usaha rintisan.', 'in_review', 11],
            ['Dedi Kurniawan', '081322211100', 'dedi.kurniawan@gmail.com', 'agen-reseller', 'Mantan staf perbankan, punya jaringan pelaku UMKM untuk dibantu legalitasnya.', 'rejected', 13],
            ['Lestari Handayani, S.H.', '081366655544', 'lestari@notarislestari.id', 'notaris-ppat', 'Kami ingin membahas skema bagi hasil untuk klien yang dirujuk.', 'contacted', 12],
            ['Rizky Ramadhan', '082144455566', 'rizky.ramadhan@gmail.com', 'agen-reseller', 'Content creator bisnis, ingin menjadi mitra afiliasi.', 'new', 0],
            ['Kantor Bersama Medan Jaya', '061-4561234', 'info@medanjayaoffice.com', 'virtual-office', 'Virtual office dan kantor bersama di pusat kota Medan.', 'approved', 15],
            ['Anita Rahmawati, S.H., M.Kn.', '081211199988', 'anita.rahmawati@notarisanita.com', 'notaris-ppat', 'Notaris di Denpasar, mendampingi banyak PMA dan ingin kolaborasi layanan PT PMA.', 'in_review', 14],
            ['Teguh Santosa', '085799988877', 'teguh.santosa@gmail.com', 'agen-reseller', 'Pengurus asosiasi pedagang, ingin mengenalkan layanan kepada anggota.', 'contacted', 16],
        ];

        foreach ($applications as [$name, $whatsapp, $email, $type, $message, $status, $daysAgo]) {
            $application = PartnershipApplication::query()->updateOrCreate(
                ['email' => $email],
                [
                    'full_name' => $name,
                    'whatsapp' => $whatsapp,
                    'partnership_type' => $type,
                    'message' => $message,
                    'status' => $status,
                    'admin_notes' => match ($status) {
                        PartnershipApplication::STATUS_CONTACTED => 'Sudah dihubungi via WhatsApp, menunggu profil dan jadwal diskusi.',
                        PartnershipApplication::STATUS_IN_REVIEW => 'Profil sedang ditinjau tim kemitraan.',
                        PartnershipApplication::STATUS_APPROVED => 'Disetujui. Perjanjian kerja sama sedang disiapkan.',
                        PartnershipApplication::STATUS_REJECTED => 'Belum sesuai dengan kriteria kemitraan saat ini.',
                        default => null,
                    },
                ],
            );

            $timestamp = now()->subDays($daysAgo)->subMinutes(($application->id * 37) % 600);

            $application->forceFill(['created_at' => $timestamp, 'updated_at' => $timestamp])->saveQuietly();
        }
    }
}
