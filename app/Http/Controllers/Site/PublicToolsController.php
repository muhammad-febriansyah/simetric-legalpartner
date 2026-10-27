<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Response;

class PublicToolsController extends Controller
{
    public function index(): Response
    {
        return inertia('public/tools/index', [
            'groups' => [
                [
                    'name' => 'Kalkulator bisnis',
                    'tools' => [
                        $this->tool('Kurs Tengah BI', 'Nilai tukar referensi untuk mata uang utama.', 'wallet', route('tools.kurs-bi')),
                        $this->tool('Kalkulator PPh 21', 'Estimasi potongan pajak penghasilan karyawan.', 'receipt', route('tools.show', 'kalkulator-pph')),
                        $this->tool('Kalkulator PPN', 'Hitung perkiraan PPN atas transaksi.', 'calculator', route('tools.show', 'kalkulator-ppn')),
                        $this->tool('Simulasi Biaya PT', 'Lihat gambaran biaya pendirian perseroan.', 'calculator', route('tools.show', 'kalkulator-biaya')),
                        $this->tool('Kalkulator Biaya Merek', 'Estimasi biaya pendaftaran berdasarkan jumlah kelas.', 'calculator', route('tools.show', 'kalkulator-biaya-merek')),
                        $this->tool('Simulasi Akta PT', 'Siapkan gambaran awal struktur pendirian PT.', 'file-text', route('tools.show', 'simulasi-akta')),
                    ],
                ],
                [
                    'name' => 'Pemeriksaan usaha',
                    'tools' => [
                        $this->tool('Cek Nama PT', 'Skrining awal format nama perseroan.', 'search', route('tools.show', 'cek-nama-pt')),
                        $this->tool('Analisis Nama Merek AI', 'Skrining awal nama merek dan potensi kemiripan.', 'sparkles', route('tools.show', 'cek-merek')),
                        $this->tool('Cek Kelas Merek', 'Cari kelas Nice yang mungkin sesuai produk atau jasa.', 'file-search', route('tools.show', 'cek-kelas-merek')),
                        $this->tool('Cek KBLI 2025', 'Cari kode usaha dan padanan versi lama.', 'list-check', route('kbli-checker.index')),
                        $this->tool('Cek Zonasi RDTR', 'Telusuri ringkasan zonasi area yang tersedia.', 'map-pin', route('tools.zoning')),
                    ],
                ],
            ],
        ]);
    }

    public function exchangeRates(): Response
    {
        $rates = $this->sourceGet('/api/tools/kurs-bi');

        return inertia('public/tools/kurs-bi', [
            'data' => $rates,
            'sourceAvailable' => is_array($rates) && isset($rates['rates']),
        ]);
    }

    public function show(string $tool): Response
    {
        $tools = [
            'kalkulator-pph' => ['Kalkulator PPh 21', 'Estimasi PPh 21 dari penghasilan bulanan dan status PTKP.', 'kalkulator-pph'],
            'kalkulator-ppn' => ['Kalkulator PPN', 'Hitung DPP, nilai PPN, dan total transaksi.', 'kalkulator-ppn'],
            'kalkulator-biaya' => ['Simulasi Biaya PT', 'Susun estimasi biaya beberapa layanan usaha.', 'kalkulator-biaya'],
            'kalkulator-biaya-merek' => ['Kalkulator Biaya Merek', 'Hitung estimasi biaya dari jumlah kelas dan status UMKM.', 'kalkulator-biaya-merek'],
            'simulasi-akta' => ['Simulasi Akta PT', 'Susun ringkasan awal data pendirian PT.', 'simulasi-akta'],
            'cek-nama-pt' => ['Cek Nama PT', 'Lakukan skrining awal format nama perusahaan.', 'cek-nama-pt'],
            'cek-merek' => ['Analisis Nama Merek', 'Skrining awal nama merek sebelum pemeriksaan resmi.', 'cek-merek'],
            'cek-kelas-merek' => ['Cek Kelas Merek', 'Cari kelas Nice berdasarkan produk atau jasa.', 'cek-kelas-merek'],
        ];

        abort_unless(isset($tools[$tool]), 404);

        [$name, $description, $sourceSlug] = $tools[$tool];

        $sourceSnapshot = $this->scrapeSourcePage('/tools/'.$sourceSlug);

        return inertia('public/tools/show', [
            'slug' => $tool,
            'name' => $name,
            'description' => $description,
            'sourceSnapshot' => $sourceSnapshot,
            'prices' => $this->scrapePrices($tool, $sourceSnapshot['text'] ?? ''),
        ]);
    }

    public function zoning(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        $zones = $this->sourceGet('/api/tools/cek-zonasi/zones') ?? [];
        $areasPayload = $this->sourceGet('/api/tools/cek-zonasi/areas') ?? [];
        $search = trim($validated['q'] ?? '');
        $areas = collect($areasPayload['items'] ?? [])
            ->filter(function (array $area) use ($search): bool {
                if ($search === '') {
                    return true;
                }

                return str_contains(mb_strtolower(implode(' ', [
                    $area['name'] ?? '',
                    $area['kota'] ?? '',
                    $area['kecamatan'] ?? '',
                    $area['primary_zone'] ?? '',
                ])), mb_strtolower($search));
            })
            ->values()
            ->all();

        return inertia('public/tools/zoning', [
            'zones' => $zones,
            'areas' => $areas,
            'query' => $search,
            'sourceAvailable' => $zones !== [] && $areasPayload !== [],
        ]);
    }

    /** @return array{name: string, description: string, icon: string, href: string, external: bool} */
    private function tool(string $name, string $description, string $icon, string $href): array
    {
        return [
            'name' => $name,
            'description' => $description,
            'icon' => $icon,
            'href' => $href,
            'external' => false,
        ];
    }

    /** @return array<string, mixed>|null */
    private function sourceGet(string $path): ?array
    {
        return Cache::remember('tools:source:'.md5($path), 900, function () use ($path): ?array {
            try {
                $response = Http::acceptJson()
                    ->connectTimeout(3)
                    ->timeout(8)
                    ->get('https://api.ijincepat.id'.$path);

                return $response->successful() ? $response->json() : null;
            } catch (ConnectionException) {
                return null;
            }
        });
    }

    /** @return array{title: string|null, description: string|null, text: string|null} */
    private function scrapeSourcePage(string $path): array
    {
        return Cache::remember('tools:scrape:v2:'.md5($path), 3600, function () use ($path): array {
            try {
                $response = Http::connectTimeout(3)
                    ->timeout(8)
                    ->get('https://ijincepat.id'.$path);

                if (! $response->successful()) {
                    return ['title' => null, 'description' => null, 'text' => null];
                }

                $html = $response->body();
                preg_match('/<title[^>]*>(.*?)<\/title>/si', $html, $titleMatch);
                preg_match('/<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\'][^>]*>/si', $html, $descriptionMatch);

                $visibleHtml = preg_replace('~<(script|style)\b[^>]*>.*?</\1>~si', ' ', $html) ?? $html;
                $text = trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags($visibleHtml))) ?? '');

                return [
                    'title' => isset($titleMatch[1]) ? trim(html_entity_decode(strip_tags($titleMatch[1]))) : null,
                    'description' => isset($descriptionMatch[1]) ? trim(html_entity_decode($descriptionMatch[1])) : null,
                    'text' => $text !== '' ? mb_substr($text, 0, 8000) : null,
                ];
            } catch (ConnectionException) {
                return ['title' => null, 'description' => null, 'text' => null];
            }
        });
    }

    /** @return list<array{name: string, price: int}> */
    private function scrapePrices(string $tool, string $text): array
    {
        $labels = match ($tool) {
            'kalkulator-biaya' => [
                'PT Perorangan', 'Pendirian PT', 'Pendirian CV', 'PT PMA', 'Yayasan/Perkumpulan',
                'Pendaftaran Merek', 'Hak Cipta', 'NIB Baru', 'Pendaftaran PKP', 'Izin Event',
                'Virtual Office', 'Pajak Reklame', 'Ubah Akta', 'Ubah NIB/KBLI', 'NPWP Badan',
            ],
            'kalkulator-biaya-merek' => ['Jasa Pengurusan & Konsultasi Legal', 'PNBP Resmi DJKI (Non-UMKM)', 'Pengecekan Database Awal'],
            default => [],
        };

        $prices = [];

        foreach ($labels as $label) {
            if (preg_match('/'.preg_quote($label, '/').'.{0,80}?Rp\s*([\d.]+)/iu', $text, $match) === 1) {
                $prices[] = ['name' => $label, 'price' => (int) str_replace('.', '', $match[1])];
            }
        }

        return $prices;
    }
}
