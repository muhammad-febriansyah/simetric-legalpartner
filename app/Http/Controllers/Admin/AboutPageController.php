<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class AboutPageController extends Controller
{
    public function edit(): Response
    {
        $aboutPage = AboutPage::query()->findOrFail(1);

        return Inertia::render('admin/about/index', [
            'aboutPage' => [
                'title' => $aboutPage->title,
                'subtitle' => $aboutPage->subtitle,
                'content' => $aboutPage->content,
                'bannerImageUrl' => $this->bannerImageUrl($aboutPage->banner_image_path),
                'vision' => $aboutPage->vision,
                'mission' => $aboutPage->mission,
                'process' => $aboutPage->process,
                'features' => $aboutPage->features,
                'status' => $aboutPage->status,
                'publishedAt' => $aboutPage->published_at?->toIso8601String(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:500'],
            'content' => ['required', 'string', 'max:100000'],
            'banner_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'vision' => ['required', 'string', 'max:100000'],
            'mission' => ['required', 'string', 'max:100000'],
            'process' => ['required', 'string', 'max:100000'],
            'features' => ['required', 'string', 'max:100000'],
            'status' => ['required', 'string', Rule::in(['draft', 'published'])],
        ]);

        $aboutPage = AboutPage::query()->findOrFail(1);
        $bannerImage = $validated['banner_image'] ?? null;
        unset($validated['banner_image']);
        $oldBannerImagePath = $aboutPage->banner_image_path;
        $newBannerImagePath = $bannerImage instanceof UploadedFile
            ? $bannerImage->store('about', 'public')
            : $oldBannerImagePath;

        try {
            $aboutPage->update([
                ...$validated,
                'banner_image_path' => $newBannerImagePath,
                'published_at' => $validated['status'] === 'published'
                    ? ($aboutPage->published_at ?? now())
                    : null,
            ]);
        } catch (Throwable $exception) {
            if ($bannerImage instanceof UploadedFile && is_string($newBannerImagePath) && $newBannerImagePath !== $oldBannerImagePath) {
                Storage::disk('public')->delete($newBannerImagePath);
            }

            throw $exception;
        }

        if ($bannerImage instanceof UploadedFile && $oldBannerImagePath && str_starts_with($oldBannerImagePath, 'about/')) {
            Storage::disk('public')->delete($oldBannerImagePath);
        }

        return back();
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
