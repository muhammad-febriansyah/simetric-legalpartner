<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePartnerRequest;
use App\Http\Requests\Admin\UpdatePartnerRequest;
use App\Models\Partner;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class PartnerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $partners = Partner::query()
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Partner $partner): array => [
                'id' => $partner->id,
                'name' => $partner->name,
                'imageUrl' => Storage::disk('public')->url($partner->image_path),
            ]);

        return Inertia::render('admin/partners/index', [
            'partners' => $partners,
            'search' => $search,
        ]);
    }

    public function store(StorePartnerRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $imagePath = $request->file('image')?->store('partners', 'public');

        if (! is_string($imagePath)) {
            throw new RuntimeException('Partner image could not be stored.');
        }

        try {
            DB::transaction(function () use ($validated, $imagePath): void {
                Partner::query()->create([
                    'name' => $validated['name'],
                    'image_path' => $imagePath,
                ]);
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($imagePath);

            throw $exception;
        }

        return to_route('admin.partners.index');
    }

    public function update(UpdatePartnerRequest $request, Partner $partner): RedirectResponse
    {
        $validated = $request->validated();
        $oldImagePath = $partner->image_path;
        $newImagePath = $request->hasFile('image')
            ? $request->file('image')?->store('partners', 'public')
            : null;

        if ($request->hasFile('image') && ! is_string($newImagePath)) {
            throw new RuntimeException('Partner image could not be stored.');
        }

        try {
            DB::transaction(function () use ($validated, $newImagePath, $partner): void {
                $partner->update([
                    'name' => $validated['name'],
                    'image_path' => $newImagePath ?? $partner->image_path,
                ]);
            });
        } catch (Throwable $exception) {
            if ($newImagePath !== null) {
                Storage::disk('public')->delete($newImagePath);
            }

            throw $exception;
        }

        if ($newImagePath !== null) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return to_route('admin.partners.index');
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        $imagePath = $partner->image_path;

        DB::transaction(function () use ($partner): void {
            $partner->delete();
        });

        Storage::disk('public')->delete($imagePath);

        return to_route('admin.partners.index');
    }
}
