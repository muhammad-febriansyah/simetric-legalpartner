<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceAddonRequest;
use App\Http\Requests\Admin\UpdateServiceAddonRequest;
use App\Models\Service;
use App\Models\ServiceAddon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceAddonController extends Controller
{
    public function index(Request $request, Service $service): Response
    {
        $search = $request->string('search')->trim()->toString();
        $addons = $service->addons()
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('sort_order')->orderBy('id')->paginate(10)->withQueryString()
            ->through(fn (ServiceAddon $addon): array => [
                'id' => $addon->id,
                'name' => $addon->name,
                'description' => $addon->description,
                'price' => $addon->price,
                'isActive' => $addon->is_active,
                'sortOrder' => $addon->sort_order,
            ]);

        return Inertia::render('admin/services/addons/index', [
            'service' => ['id' => $service->id, 'name' => $service->name, 'slug' => $service->slug],
            'addons' => $addons,
            'search' => $search,
        ]);
    }

    public function create(Service $service): Response
    {
        return Inertia::render('admin/services/addons/create', [
            'service' => ['id' => $service->id, 'name' => $service->name, 'slug' => $service->slug],
            'addon' => null,
        ]);
    }

    public function store(StoreServiceAddonRequest $request, Service $service): RedirectResponse
    {
        $service->addons()->create($request->validated());

        return to_route('admin.services.addons.index', $service);
    }

    public function edit(Service $service, ServiceAddon $addon): Response
    {
        return Inertia::render('admin/services/addons/edit', [
            'service' => ['id' => $service->id, 'name' => $service->name, 'slug' => $service->slug],
            'addon' => [
                'id' => $addon->id,
                'name' => $addon->name,
                'description' => $addon->description,
                'price' => $addon->price,
                'isActive' => $addon->is_active,
                'sortOrder' => $addon->sort_order,
            ],
        ]);
    }

    public function update(UpdateServiceAddonRequest $request, Service $service, ServiceAddon $addon): RedirectResponse
    {
        $addon->update($request->validated());

        return to_route('admin.services.addons.index', $service);
    }

    public function destroy(Service $service, ServiceAddon $addon): RedirectResponse
    {
        $addon->delete();

        return to_route('admin.services.addons.index', $service);
    }
}
