<?php

use App\Http\Controllers\Admin\AboutPageController as AdminAboutPageController;
use App\Http\Controllers\Admin\AdminNotificationController;
use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Admin\LegalPageController as AdminLegalPageController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;
use App\Http\Controllers\Admin\PartnershipApplicationController as AdminPartnershipApplicationController;
use App\Http\Controllers\Admin\ServiceCategoryController as AdminServiceCategoryController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\ServicePackageController as AdminServicePackageController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\WebsiteSettingsController;
use App\Http\Controllers\Site\AboutPageController as SiteAboutPageController;
use App\Http\Controllers\Site\ArticleController as SiteArticleController;
use App\Http\Controllers\Site\ContactController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\KbliCheckerController;
use App\Http\Controllers\Site\KbliController;
use App\Http\Controllers\Site\LegalPageController as SiteLegalPageController;
use App\Http\Controllers\Site\PartnershipApplicationController;
use App\Http\Controllers\Site\PublicToolsController;
use App\Http\Controllers\Site\ServiceController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang-kami', [SiteAboutPageController::class, 'show'])->name('about.show');
Route::get('/layanan', [ServiceController::class, 'index'])->name('services.index');
Route::get('/layanan/{slug}', [ServiceController::class, 'show'])->name('services.show');
Route::get('/blog', [SiteArticleController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [SiteArticleController::class, 'show'])->name('blog.show');
Route::get('/tools', [PublicToolsController::class, 'index'])->name('tools.index');
Route::get('/tools/kurs-bi', [PublicToolsController::class, 'exchangeRates'])->name('tools.kurs-bi');
Route::get('/tools/cek-zonasi', [PublicToolsController::class, 'zoning'])->name('tools.zoning');
Route::get('/tools/{tool}', [PublicToolsController::class, 'show'])->whereIn('tool', [
    'kalkulator-pph', 'kalkulator-ppn', 'kalkulator-biaya', 'kalkulator-biaya-merek',
    'simulasi-akta', 'cek-nama-pt', 'cek-merek', 'cek-kelas-merek',
])->name('tools.show');
Route::get('/kbli', [KbliController::class, 'index'])->name('kbli.index');
Route::get('/tools/cek-kbli', [KbliCheckerController::class, 'index'])->name('kbli-checker.index');
Route::get('/legal/{slug}', [SiteLegalPageController::class, 'show'])->name('legal.show');
Route::get('/kontak', [ContactController::class, 'show'])->name('contact.show');
Route::get('/kerjasama', [PartnershipApplicationController::class, 'index'])->name('partnership.index');
Route::post('/kerjasama', [PartnershipApplicationController::class, 'store'])->middleware('throttle:5,1')->name('partnership.store');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/notifications/{notification}/read', [AdminNotificationController::class, 'markRead'])
        ->name('notifications.read');
    Route::get('/about-us', [AdminAboutPageController::class, 'edit'])->name('about-us.edit');
    Route::put('/about-us', [AdminAboutPageController::class, 'update'])->name('about-us.update');
    Route::get('/settings/website', [WebsiteSettingsController::class, 'edit'])->name('settings.website.edit');
    Route::put('/settings/website', [WebsiteSettingsController::class, 'update'])->name('settings.website.update');
    Route::get('/legal-pages', [AdminLegalPageController::class, 'index'])->name('legal-pages.index');
    Route::put('/legal-pages/{legalPage:slug}', [AdminLegalPageController::class, 'update'])->name('legal-pages.update');
    Route::get('/service-packages', [AdminServicePackageController::class, 'all'])->name('service-packages.index');
    Route::get('/faqs', [AdminFaqController::class, 'all'])->name('faqs.all');
    Route::resource('categories', AdminServiceCategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('users', AdminUserController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('partners', AdminPartnerController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('partnership-applications', AdminPartnershipApplicationController::class)->only(['index', 'update']);
    Route::resource('articles', AdminArticleController::class)->except(['show']);
    Route::resource('services.faqs', AdminFaqController::class)
        ->except(['show'])
        ->scoped(['service' => 'id', 'faq' => 'id']);
    Route::resource('services.packages', AdminServicePackageController::class)
        ->except(['show'])
        ->scoped(['service' => 'id', 'package' => 'slug']);
    Route::resource('services', AdminServiceController::class)->only(['index', 'create', 'store', 'edit', 'update']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
