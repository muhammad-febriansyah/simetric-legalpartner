@php
    $siteBrand = $page['props']['siteBrand'] ?? [];
    $siteName = $siteBrand['siteName'] ?? config('app.name', 'LegalPartner.ID');
    $metaTitle = $siteBrand['metaTitle'] ?? $siteName;
    $metaDescription = $siteBrand['metaDescription'] ?? '';
    $ogImage = $siteBrand['ogImage'] ?? $siteBrand['logo'] ?? '';
    $ogImageUrl = $ogImage !== ''
        ? (str_starts_with($ogImage, 'http') ? $ogImage : url($ogImage))
        : null;
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <style>
            html {
                background-color: #fff;
                color-scheme: light;
            }

            html.dark {
                background-color: #F7F8FD !important;
                color-scheme: light !important;
            }
        </style>

        <link rel="icon" href="{{ $siteBrand['favicon'] ?? '/images/legalpartner-favicon-192.png' }}">
        <link rel="apple-touch-icon" href="{{ $siteBrand['favicon'] ?? '/images/legalpartner-favicon-192.png' }}">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title inertia>{{ $metaTitle }}</title>
            <meta name="description" content="{{ $metaDescription }}">
            <meta property="og:type" content="website">
            <meta property="og:site_name" content="{{ $siteName }}">
            <meta property="og:title" content="{{ $metaTitle }}">
            <meta property="og:description" content="{{ $metaDescription }}">
            <meta property="og:url" content="{{ url()->current() }}">
            @if ($ogImageUrl)
                <meta property="og:image" content="{{ $ogImageUrl }}">
                <meta property="og:image:alt" content="{{ $siteBrand['logoAltText'] ?? $siteName }}">
            @endif
            <meta property="og:locale" content="id_ID">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="{{ $metaTitle }}">
            <meta name="twitter:description" content="{{ $metaDescription }}">
            @if ($ogImageUrl)
                <meta name="twitter:image" content="{{ $ogImageUrl }}">
            @endif
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
