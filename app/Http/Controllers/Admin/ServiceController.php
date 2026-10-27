<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $categoryId = $request->query('category_id');
        $status = $request->query('status');

        $services = Service::query()
            ->with('category:id,name')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->when(is_numeric($categoryId), fn (Builder $query) => $query->where('service_category_id', (int) $categoryId))
            ->when(in_array($status, ['active', 'inactive'], true), fn (Builder $query) => $query->where('is_active', $status === 'active'))
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Service $service): array => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
                'category' => $service->category->name,
                'isActive' => $service->is_active,
                'isFeatured' => $service->is_featured,
            ]);

        return Inertia::render('admin/services/index', [
            'services' => $services,
            'categories' => ServiceCategory::query()->orderBy('sort_order')->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
                'categoryId' => is_numeric($categoryId) ? (string) $categoryId : '',
                'status' => in_array($status, ['active', 'inactive'], true) ? $status : '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/services/create', [
            'categories' => ServiceCategory::query()->orderBy('sort_order')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $imagePath = $request->file('hero_image_file')?->store('services', 'public');

        try {
            $service = Service::query()->create($this->serviceAttributes($validated, $imagePath));
        } catch (Throwable $exception) {
            if ($imagePath !== null) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $exception;
        }

        return to_route('admin.services.edit', $service);
    }

    public function edit(Service $service): Response
    {
        $service->loadCount(['packages', 'faqs']);

        return Inertia::render('admin/services/edit', [
            'service' => [
                'id' => $service->id,
                'categoryId' => $service->service_category_id,
                'name' => $service->name,
                'slug' => $service->slug,
                'excerpt' => $service->excerpt,
                'description' => $service->description,
                'heroImage' => $this->imageUrl($service->hero_image),
                'heroImageAlt' => $service->hero_image_alt,
                'requirementsText' => implode("\n", $service->requirements ?? []),
                'processStepsText' => implode("\n", $service->process_steps ?? []),
                'durationLabel' => $service->duration_label,
                'metaTitle' => $service->meta_title,
                'metaDescription' => $service->meta_description,
                'isFeatured' => $service->is_featured,
                'isActive' => $service->is_active,
                'sortOrder' => $service->sort_order,
            ],
            'packageCount' => $service->packages_count,
            'faqCount' => $service->faqs_count,
            'categories' => ServiceCategory::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $validated = $request->validated();
        $oldImagePath = $service->hero_image;
        $newImagePath = $request->file('hero_image_file')?->store('services', 'public');

        try {
            $service->update($this->serviceAttributes($validated, $newImagePath ?? $oldImagePath));
        } catch (Throwable $exception) {
            if ($newImagePath !== null) {
                Storage::disk('public')->delete($newImagePath);
            }

            throw $exception;
        }

        if ($newImagePath !== null && $oldImagePath !== $newImagePath) {
            $this->deleteStoredImage($oldImagePath);
        }

        return to_route('admin.services.edit', $service);
    }

    /** @return list<string> */
    private function linesToArray(?string $lines): array
    {
        if ($lines === null || trim($lines) === '') {
            return [];
        }

        return collect(preg_split('/\R/', $lines) ?: [])
            ->map(fn (string $line): string => trim($line))
            ->filter()
            ->values()
            ->all();
    }

    /** @param array<string, mixed> $validated
     * @return array<string, mixed>
     */
    private function serviceAttributes(array $validated, ?string $imagePath): array
    {
        return [
            'service_category_id' => $validated['service_category_id'],
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'excerpt' => $validated['excerpt'] ?? null,
            'description' => $validated['description'],
            'hero_image' => $imagePath,
            'hero_image_alt' => $validated['hero_image_alt'] ?? null,
            'requirements' => $this->linesToArray($validated['requirements_text'] ?? null),
            'process_steps' => $this->linesToArray($validated['process_steps_text'] ?? null),
            'duration_label' => $validated['duration_label'] ?? null,
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
            'is_featured' => $validated['is_featured'],
            'is_active' => $validated['is_active'],
            'sort_order' => $validated['sort_order'],
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        if (str_starts_with($path, '/') || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }

    private function deleteStoredImage(?string $path): void
    {
        if ($path !== null && str_starts_with($path, 'services/')) {
            Storage::disk('public')->delete($path);
        }
    }
}
