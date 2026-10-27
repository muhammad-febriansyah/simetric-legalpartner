<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateWebsiteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'site_name' => ['required', 'string', 'max:120'],
            'brand_byline' => ['nullable', 'string', 'max:160'],
            'site_tagline' => ['nullable', 'string', 'max:255'],
            'site_url' => ['nullable', 'url', 'max:255'],
            'logo_alt_text' => ['nullable', 'string', 'max:160'],
            'default_meta_title' => ['nullable', 'string', 'max:70'],
            'default_meta_description' => ['nullable', 'string', 'max:320'],
            'meta_keywords' => ['nullable', 'string', 'max:500'],
            'google_site_verification' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:160'],
            'contact_phone' => ['nullable', 'string', 'max:40'],
            'whatsapp_number' => ['nullable', 'string', 'max:40'],
            'business_hours' => ['nullable', 'string', 'max:120'],
            'contact_address' => ['nullable', 'string', 'max:500'],
            'google_maps_keyword' => ['nullable', 'string', 'max:180'],
            'google_maps_embed_url' => ['nullable', 'url', 'max:1000'],
            'social_instagram' => ['nullable', 'url', 'max:255'],
            'social_facebook' => ['nullable', 'url', 'max:255'],
            'social_linkedin' => ['nullable', 'url', 'max:255'],
            'social_tiktok' => ['nullable', 'url', 'max:255'],
            'social_youtube' => ['nullable', 'url', 'max:255'],
            'social_x' => ['nullable', 'url', 'max:255'],
            'logo_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048', 'dimensions:min_width=320,min_height=80,max_width=2400,max_height=1200'],
            'favicon_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:1024', 'dimensions:min_width=64,min_height=64,max_width=1024,max_height=1024,ratio=1/1'],
            'og_image_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:3072', 'dimensions:min_width=600,min_height=315,max_width=2400,max_height=1260'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'logo_file.dimensions' => 'Logo harus minimal 320 × 80 px dan maksimal 2400 × 1200 px.',
            'favicon_file.dimensions' => 'Favicon harus berbentuk persegi, minimal 64 × 64 px dan maksimal 1024 × 1024 px.',
            'og_image_file.dimensions' => 'Gambar share / OG harus minimal 600 × 315 px dan maksimal 2400 × 1260 px.',
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            $url = $this->input('google_maps_embed_url');

            if (! is_string($url) || $url === '') {
                return;
            }

            $host = parse_url($url, PHP_URL_HOST);
            $path = parse_url($url, PHP_URL_PATH);
            $allowedHosts = ['google.com', 'www.google.com', 'maps.google.com'];

            if (! in_array($host, $allowedHosts, true) || ! is_string($path) || ! str_starts_with($path, '/maps')) {
                $validator->errors()->add('google_maps_embed_url', 'Gunakan URL Google Maps dengan path /maps.');
            }
        }];
    }
}
