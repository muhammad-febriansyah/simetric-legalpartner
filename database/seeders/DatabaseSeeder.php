<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (app()->isLocal()) {
            $this->call(CatalogDemoSeeder::class);
            $this->call(ArticleDemoSeeder::class);
            $this->call(PartnerDemoSeeder::class);
            $this->call(PartnershipApplicationDemoSeeder::class);
            $this->call(WebsiteSettingsDemoSeeder::class);
            $this->call(LegalPageDemoSeeder::class);
            $this->call(AboutPageSeeder::class);
            $this->call(AdminUserSeeder::class);
            $this->call(UserDemoSeeder::class);
        }
    }
}
