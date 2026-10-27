<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Inertia\Response;

class ContactController extends Controller
{
    private const MAPS_EMBED_PREFIX = 'https://www.google.com/maps';

    public function show(): Response
    {
        $settings = SiteSetting::query()
            ->whereIn('key', ['contact_email', 'contact_phone', 'whatsapp_number', 'contact_address', 'google_maps_embed_url'])
            ->pluck('value', 'key');

        $mapsUrl = (string) $settings->get('google_maps_embed_url');

        return inertia('public/contact', [
            'contact' => [
                'email' => $settings->get('contact_email') ?: null,
                'phone' => $settings->get('contact_phone') ?: null,
                'whatsapp' => preg_replace('/\D+/', '', (string) $settings->get('whatsapp_number')) ?: null,
                'address' => $settings->get('contact_address') ?: null,
                'mapsEmbedUrl' => str_starts_with($mapsUrl, self::MAPS_EMBED_PREFIX) ? $mapsUrl : null,
            ],
        ]);
    }
}
