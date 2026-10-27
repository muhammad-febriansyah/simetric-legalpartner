<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Faq;
use App\Models\Partner;
use App\Models\PartnershipApplication;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $months = [];
        $serviceActivity = [];
        $articleActivity = [];
        $partnerActivity = [];

        for ($offset = 5; $offset >= 0; $offset--) {
            $month = now()->startOfMonth()->subMonths($offset);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->isSameMonth(now()) ? now() : $month->copy()->endOfMonth();

            $months[] = $month->copy()->locale('id')->translatedFormat('M');
            $serviceActivity[] = Service::query()->whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $articleActivity[] = Article::query()->whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $partnerActivity[] = Partner::query()->whereBetween('created_at', [$monthStart, $monthEnd])->count();
        }

        $activeServices = Service::query()->where('is_active', true)->count();
        $totalServices = Service::query()->count();
        $activePackages = ServicePackage::query()->where('is_active', true)->count();
        $totalPackages = ServicePackage::query()->count();
        $publishedArticles = Article::query()->where('status', 'published')->count();
        $draftArticles = Article::query()->where('status', 'draft')->count();
        $totalArticles = Article::query()->count();
        $totalCategories = ServiceCategory::query()->count();
        $totalFaqs = Faq::query()->count();
        $totalPartners = Partner::query()->count();
        $newPartnershipApplications = PartnershipApplication::query()
            ->where('status', PartnershipApplication::STATUS_NEW)
            ->count();

        return Inertia::render('dashboard', [
            'stats' => [
                'activeServices' => $activeServices,
                'totalServices' => $totalServices,
                'activePackages' => $activePackages,
                'totalPackages' => $totalPackages,
                'publishedArticles' => $publishedArticles,
                'draftArticles' => $draftArticles,
                'totalArticles' => $totalArticles,
                'totalCategories' => $totalCategories,
                'totalFaqs' => $totalFaqs,
                'totalPartners' => $totalPartners,
                'newPartnershipApplications' => $newPartnershipApplications,
            ],
            'charts' => [
                'activity' => [
                    'labels' => $months,
                    'series' => [
                        ['name' => 'Layanan', 'data' => $serviceActivity],
                        ['name' => 'Artikel', 'data' => $articleActivity],
                        ['name' => 'Partner', 'data' => $partnerActivity],
                    ],
                ],
                'content' => [
                    'labels' => ['Kategori', 'Layanan', 'Paket harga', 'FAQ', 'Artikel', 'Partner'],
                    'series' => [$totalCategories, $totalServices, $totalPackages, $totalFaqs, $totalArticles, $totalPartners],
                ],
            ],
            'recentServices' => Service::query()
                ->latest('updated_at')
                ->limit(5)
                ->get(['id', 'name', 'is_active', 'updated_at'])
                ->map(fn (Service $service): array => [
                    'id' => $service->id,
                    'name' => $service->name,
                    'isActive' => $service->is_active,
                    'updatedAt' => $service->updated_at?->toIso8601String(),
                ]),
            'generatedAt' => now()->toIso8601String(),
        ]);
    }
}
