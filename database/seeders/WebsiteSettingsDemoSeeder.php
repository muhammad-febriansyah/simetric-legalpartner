<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WebsiteSettingsDemoSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $settings = [
            'site_name' => 'LegalPartner.ID',
            'brand_byline' => 'by Simetric Consulting Group',
            'site_tagline' => 'Partner legalitas dan perizinan usaha Anda, dari konsultasi sampai dokumen selesai.',
            'site_url' => 'https://legalpartner.example',
            'logo_path' => '/images/legalpartner-logo.png',
            'logo_alt_text' => 'LegalPartner.ID by Simetric Consulting Group',
            'favicon_path' => '/images/legalpartner-favicon-192.png',
            'og_image_path' => '',
            'default_meta_title' => 'LegalPartner.ID — by Simetric Consulting Group',
            'default_meta_description' => 'Layanan pendirian PT, CV, perizinan usaha, pendaftaran merek, dan perpajakan dengan pendampingan yang jelas dari LegalPartner.ID.',
            'meta_keywords' => 'LegalPartner.ID, legalitas usaha, pendirian PT, perizinan usaha, pendaftaran merek',
            'google_site_verification' => '',
            'contact_email' => 'halo@legalpartner.id',
            'contact_phone' => '+62 21 2930 1188',
            'whatsapp_number' => '6281255500100',
            'business_hours' => 'Senin - Jumat, 08.00 - 17.00 WIB',
            'contact_address' => 'Jl. Wijaya II No. 18, Kebayoran Baru, Jakarta Selatan 12160',
            'google_maps_keyword' => 'LegalPartner.ID, Kebayoran Baru, Jakarta Selatan',
            'google_maps_embed_url' => 'https://www.google.com/maps?q=Kebayoran%20Baru%2C%20Jakarta%20Selatan&output=embed',
            'social_instagram' => 'https://www.instagram.com/legalpartner.id',
            'social_facebook' => '',
            'social_linkedin' => 'https://www.linkedin.com/company/legalpartner-id',
            'social_tiktok' => '',
            'social_youtube' => 'https://www.youtube.com/@legalpartnerid',
            'social_x' => '',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::query()->firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
