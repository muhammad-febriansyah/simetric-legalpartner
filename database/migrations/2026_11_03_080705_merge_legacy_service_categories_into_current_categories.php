<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Move legacy category services into the consolidated public categories.
     */
    public function up(): void
    {
        DB::transaction(function (): void {
            $this->mergeCategory(
                'pendirian-badan-usaha',
                'legalitas-usaha',
                'Legalitas Usaha',
                'Pendirian dan perubahan badan usaha, kontrak bisnis, serta legalitas untuk operasional dan izin sektor khusus.',
            );
            $this->mergeCategory(
                'legal-korporasi',
                'legalitas-usaha',
                'Legalitas Usaha',
                'Pendirian dan perubahan badan usaha, kontrak bisnis, serta legalitas untuk operasional dan izin sektor khusus.',
            );
            $this->mergeCategory(
                'perizinan-sektor-khusus',
                'perizinan-usaha',
                'Perizinan Usaha',
                'NIB, OSS RBA, izin operasional, SBUJK, persetujuan bangunan gedung, dan izin sektor khusus.',
            );
        });
    }

    /**
     * Restore previous categories and return catalog services to their former groups.
     */
    public function down(): void
    {
        DB::transaction(function (): void {
            $legalitasId = $this->categoryId('pendirian-badan-usaha', [
                'name' => 'Pendirian Badan Usaha',
                'description' => 'Pendirian PT, CV, PMA, dan yayasan lengkap dengan akta, SK Kemenkumham, NPWP, dan NIB.',
                'sort_order' => 1,
            ]);
            $legalKorporasiId = $this->categoryId('legal-korporasi', [
                'name' => 'Legal Korporasi',
                'description' => 'Perubahan akta, penutupan perusahaan, dan penyusunan perjanjian bisnis.',
                'sort_order' => 5,
            ]);
            $perizinanKhususId = $this->categoryId('perizinan-sektor-khusus', [
                'name' => 'Perizinan Sektor Khusus',
                'description' => 'Izin apotek, klinik, dan izin edar produk untuk sektor yang diatur ketat.',
                'sort_order' => 8,
            ]);

            DB::table('service_categories')
                ->where('slug', 'legalitas-usaha')
                ->update([
                    'name' => 'Pendirian Badan Usaha',
                    'slug' => 'pendirian-badan-usaha',
                    'description' => 'Pendirian PT, CV, PMA, dan yayasan lengkap dengan akta, SK Kemenkumham, NPWP, dan NIB.',
                    'updated_at' => now(),
                ]);
            DB::table('service_categories')
                ->where('slug', 'perizinan-usaha')
                ->update([
                    'description' => 'NIB, OSS RBA, izin operasional, SBUJK, dan persetujuan bangunan gedung.',
                    'updated_at' => now(),
                ]);

            $this->moveServices(['perubahan-akta', 'penutupan-pt', 'kontrak-perjanjian'], $legalKorporasiId);
            $this->moveServices(['izin-apotek-klinik', 'izin-edar-bpom'], $perizinanKhususId);
            $this->moveServices(['pendirian-pt', 'pt-perorangan', 'pendirian-cv', 'pendirian-pma', 'pendirian-yayasan'], $legalitasId);
        });
    }

    private function mergeCategory(string $sourceSlug, string $targetSlug, string $name, string $description): void
    {
        $source = DB::table('service_categories')->where('slug', $sourceSlug)->first();
        $target = DB::table('service_categories')->where('slug', $targetSlug)->first();

        if ($source !== null && $target === null) {
            DB::table('service_categories')->where('id', $source->id)->update([
                'name' => $name,
                'slug' => $targetSlug,
                'description' => $description,
                'updated_at' => now(),
            ]);

            return;
        }

        if ($source !== null && $target !== null) {
            DB::table('services')
                ->where('service_category_id', $source->id)
                ->update(['service_category_id' => $target->id, 'updated_at' => now()]);
            DB::table('service_categories')->where('id', $source->id)->delete();
        }

        if ($target !== null) {
            DB::table('service_categories')->where('id', $target->id)->update([
                'name' => $name,
                'description' => $description,
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * @param  array{name: string, description: string, sort_order: int}  $attributes
     */
    private function categoryId(string $slug, array $attributes): int
    {
        $categoryId = DB::table('service_categories')->where('slug', $slug)->value('id');

        if ($categoryId !== null) {
            return (int) $categoryId;
        }

        return (int) DB::table('service_categories')->insertGetId([
            ...$attributes,
            'slug' => $slug,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * @param  list<string>  $serviceSlugs
     */
    private function moveServices(array $serviceSlugs, int $categoryId): void
    {
        DB::table('services')
            ->whereIn('slug', $serviceSlugs)
            ->update(['service_category_id' => $categoryId, 'updated_at' => now()]);
    }
};
