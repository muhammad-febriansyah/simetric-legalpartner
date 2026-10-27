<?php

namespace Database\Seeders;

use App\Models\Partner;
use Database\Seeders\Concerns\CopiesDemoAssets;
use Illuminate\Database\Seeder;

class PartnerDemoSeeder extends Seeder
{
    use CopiesDemoAssets;

    /** @var array<string, string> */
    private const PARTNERS = [
        'astra-international' => 'Astra International',
        'bank-cimb-niaga' => 'Bank CIMB Niaga',
        'bank-mandiri' => 'Bank Mandiri Taspen',
        'bank-negara-indonesia' => 'Bank Negara Indonesia',
        'bank-permata' => 'PermataBank',
        'bank-rakyat-indonesia' => 'Bank Rakyat Indonesia',
        'blibli' => 'Blibli',
        'bukalapak' => 'Bukalapak',
        'gojek' => 'Gojek',
        'indofood' => 'Indofood',
        'kompas-gramedia' => 'Kompas Gramedia',
        'ovo' => 'OVO',
        'pegadaian' => 'Pegadaian',
        'pertamina' => 'Pertamina Gas Negara',
        'shopee' => 'Shopee',
        'sinar-mas' => 'Sinar Mas Land',
        'telkom-indonesia' => 'Telkom Indonesia',
        'telkomsel' => 'Telkomsel',
        'tokopedia' => 'Tokopedia',
        'traveloka' => 'Traveloka',
    ];

    /**
     * Seed partners with bundled logo images.
     */
    public function run(): void
    {
        foreach (self::PARTNERS as $slug => $name) {
            Partner::query()->updateOrCreate(
                ['name' => $name],
                ['image_path' => $this->publishDemoAsset("partners/{$slug}.png", 'partners')],
            );
        }
    }
}
