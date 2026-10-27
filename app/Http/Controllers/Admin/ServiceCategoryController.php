<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceCategoryRequest;
use App\Http\Requests\Admin\UpdateServiceCategoryRequest;
use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $categories = ServiceCategory::query()
            ->withCount('services')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (ServiceCategory $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
                'sortOrder' => $category->sort_order,
                'isActive' => $category->is_active,
                'serviceCount' => $category->services_count,
            ]);

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'search' => $search,
        ]);
    }

    public function store(StoreServiceCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = $this->uniqueSlug($validated['name']);

        ServiceCategory::query()->create($validated);

        return to_route('admin.categories.index');
    }

    public function update(UpdateServiceCategoryRequest $request, ServiceCategory $category): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = $this->uniqueSlug($validated['name'], $category);

        $category->update($validated);

        return to_route('admin.categories.index');
    }

    public function destroy(ServiceCategory $category): RedirectResponse
    {
        if ($category->services()->exists()) {
            return back()->withErrors([
                'category' => 'Kategori masih dipakai layanan dan tidak dapat dihapus.',
            ]);
        }

        $category->delete();

        return to_route('admin.categories.index');
    }

    private function uniqueSlug(string $name, ?ServiceCategory $category = null): string
    {
        $baseSlug = Str::slug($name) ?: 'kategori';
        $slug = $baseSlug;
        $suffix = 2;

        while (ServiceCategory::query()
            ->where('slug', $slug)
            ->when($category !== null, fn (Builder $query) => $query->whereKeyNot($category->getKey()))
            ->exists()) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
