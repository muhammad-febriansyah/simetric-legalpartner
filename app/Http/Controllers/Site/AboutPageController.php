<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\AboutPage;
use App\Models\Article;
use App\Models\Service;
use App\Models\ServicePackage;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AboutPageController extends Controller
{
    public function show(): Response
    {
        $aboutPage = AboutPage::query()
            ->where('status', 'published')
            ->findOrFail(1);

        return Inertia::render('public/about', [
            'aboutPage' => [
                'title' => $aboutPage->title,
                'subtitle' => $aboutPage->subtitle,
                'content' => $aboutPage->content,
                'bannerImageUrl' => $this->bannerImageUrl($aboutPage->banner_image_path),
                'vision' => $aboutPage->vision,
                'mission' => $aboutPage->mission,
                'process' => $aboutPage->process,
                'features' => $aboutPage->features,
            ],
            'stats' => [
                'services' => Service::query()->where('is_active', true)->count(),
                'packages' => ServicePackage::query()->where('is_active', true)->count(),
                'articles' => Article::query()->where('status', 'published')->where('published_at', '<=', now())->count(),
            ],
        ]);
    }

    private function bannerImageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        if (str_starts_with($path, '/') || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
