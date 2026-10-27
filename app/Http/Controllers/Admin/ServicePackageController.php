<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServicePackageRequest;
use App\Http\Requests\Admin\UpdateServicePackageRequest;
use App\Models\Service;
use App\Models\ServicePackage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServicePackageController extends Controller
{
    public function all(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $packages = ServicePackage::query()
            ->with('service:id,name,slug')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhereHas('service', function ($serviceQuery) use ($search): void {
                            $serviceQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('service_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (ServicePackage $package): array => [
                'id' => $package->id,
                'name' => $package->name,
                'slug' => $package->slug,
                'price' => $package->price,
                'priceLabel' => $package->price_label,
                'isPopular' => $package->is_popular,
                'isActive' => $package->is_active,
                'service' => [
                    'id' => $package->service->id,
                    'name' => $package->service->name,
                    'slug' => $package->service->slug,
                ],
            ]);

        return Inertia::render('admin/service-packages/index', [
            'packages' => $packages,
            'search' => $search,
        ]);
    }

    public function index(Request $request, Service $service): Response
    {
        $search = $request->string('search')->trim()->toString();
        $packages = $service->packages()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (ServicePackage $package): array => [
                'id' => $package->id,
                'name' => $package->name,
                'slug' => $package->slug,
                'price' => $package->price,
                'priceLabel' => $package->price_label,
                'isPopular' => $package->is_popular,
                'isActive' => $package->is_active,
            ]);

        return Inertia::render('admin/services/packages/index', [
            'service' => ['id' => $service->id, 'name' => $service->name, 'slug' => $service->slug],
            'packages' => $packages,
            'search' => $search,
        ]);
    }

    public function create(Service $service): Response
    {
        return Inertia::render('admin/services/packages/create', [
            'service' => ['id' => $service->id, 'name' => $service->name, 'slug' => $service->slug],
            'package' => null,
        ]);
    }

    public function store(StoreServicePackageRequest $request, Service $service): RedirectResponse
    {
        $service->packages()->create($this->packageAttributes($request->validated()));

        return to_route('admin.services.packages.index', $service);
    }

    public function edit(Service $service, ServicePackage $package): Response
    {
        return Inertia::render('admin/services/packages/edit', [
            'service' => ['id' => $service->id, 'name' => $service->name, 'slug' => $service->slug],
            'package' => [
                'id' => $package->id,
                'name' => $package->name,
                'slug' => $package->slug,
                'description' => $package->description,
                'price' => $package->price,
                'priceLabel' => $package->price_label,
                'featuresText' => implode("\n", $package->features ?? []),
                'isPopular' => $package->is_popular,
                'isActive' => $package->is_active,
                'sortOrder' => $package->sort_order,
            ],
        ]);
    }

    public function update(UpdateServicePackageRequest $request, Service $service, ServicePackage $package): RedirectResponse
    {
        $package->update($this->packageAttributes($request->validated()));

        return to_route('admin.services.packages.index', $service);
    }

    public function destroy(Service $service, ServicePackage $package): RedirectResponse
    {
        $package->delete();

        return to_route('admin.services.packages.index', $service);
    }

    /** @param array<string, mixed> $validated
     * @return array<string, mixed>
     */
    private function packageAttributes(array $validated): array
    {
        return [
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'] ?? null,
            'price_label' => $validated['price_label'] ?? null,
            'features' => collect(preg_split('/\R/', $validated['features_text']))
                ->map(fn (string $feature): string => trim($feature))
                ->filter()
                ->values()
                ->all(),
            'is_popular' => $validated['is_popular'],
            'is_active' => $validated['is_active'],
            'sort_order' => $validated['sort_order'],
        ];
    }
}
