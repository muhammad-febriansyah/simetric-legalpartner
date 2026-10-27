<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateWebsiteSettingsRequest;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class WebsiteSettingsController extends Controller
{
    /** @var array<string, string> */
    private const SETTING_FIELDS = [
        'site_name' => 'site_name',
        'brand_byline' => 'brand_byline',
        'site_tagline' => 'site_tagline',
        'site_url' => 'site_url',
        'logo_alt_text' => 'logo_alt_text',
        'default_meta_title' => 'default_meta_title',
        'default_meta_description' => 'default_meta_description',
        'meta_keywords' => 'meta_keywords',
        'google_site_verification' => 'google_site_verification',
        'contact_email' => 'contact_email',
        'contact_phone' => 'contact_phone',
        'whatsapp_number' => 'whatsapp_number',
        'business_hours' => 'business_hours',
        'contact_address' => 'contact_address',
        'google_maps_keyword' => 'google_maps_keyword',
        'google_maps_embed_url' => 'google_maps_embed_url',
        'social_instagram' => 'social_instagram',
        'social_facebook' => 'social_facebook',
        'social_linkedin' => 'social_linkedin',
        'social_tiktok' => 'social_tiktok',
        'social_youtube' => 'social_youtube',
        'social_x' => 'social_x',
    ];

    public function edit(): Response
    {
        $settings = SiteSetting::query()->pluck('value', 'key')->all();

        return Inertia::render('admin/settings/website', [
            'settings' => array_merge(array_fill_keys(array_keys(self::SETTING_FIELDS), ''), $settings),
            'assets' => [
                'logo' => $this->imageUrl($settings['logo_path'] ?? null),
                'favicon' => $this->imageUrl($settings['favicon_path'] ?? null),
                'og_image' => $this->imageUrl($settings['og_image_path'] ?? null),
            ],
        ]);
    }

    public function update(UpdateWebsiteSettingsRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $newAssets = [];
        $oldAssets = [];

        foreach (['logo_file' => 'logo_path', 'favicon_file' => 'favicon_path', 'og_image_file' => 'og_image_path'] as $fileField => $settingKey) {
            if ($request->hasFile($fileField)) {
                $newAssets[$settingKey] = $request->file($fileField)->store('site-settings', 'public');
                $oldAssets[$settingKey] = SiteSetting::query()->where('key', $settingKey)->value('value');
            }
        }

        try {
            DB::transaction(function () use ($validated, $newAssets): void {
                foreach (self::SETTING_FIELDS as $field => $settingKey) {
                    SiteSetting::query()->updateOrCreate(
                        ['key' => $settingKey],
                        ['value' => $validated[$field] ?? ''],
                    );
                }

                foreach ($newAssets as $settingKey => $path) {
                    SiteSetting::query()->updateOrCreate(
                        ['key' => $settingKey],
                        ['value' => $path],
                    );
                }
            });
        } catch (Throwable $exception) {
            foreach ($newAssets as $path) {
                Storage::disk('public')->delete($path);
            }

            throw $exception;
        }

        foreach ($oldAssets as $oldPath) {
            if (is_string($oldPath) && ! str_starts_with($oldPath, '/') && str_starts_with($oldPath, 'site-settings/')) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        return back();
    }

    private function imageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, '/') ? $path : Storage::disk('public')->url($path);
    }
}
