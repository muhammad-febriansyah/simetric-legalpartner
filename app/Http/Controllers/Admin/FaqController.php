<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFaqRequest;
use App\Http\Requests\Admin\UpdateFaqRequest;
use App\Models\Faq;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function all(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $faqs = Faq::query()
            ->whereNotNull('service_id')
            ->with('service:id,name,slug')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('question', 'like', "%{$search}%")
                        ->orWhere('answer', 'like', "%{$search}%")
                        ->orWhereHas('service', function (Builder $serviceQuery) use ($search): void {
                            $serviceQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('service_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Faq $faq): array => [
                'id' => $faq->id,
                'serviceId' => $faq->service->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'answerPreview' => Str::limit($faq->answer, 120),
                'isActive' => $faq->is_active,
                'sortOrder' => $faq->sort_order,
                'service' => [
                    'id' => $faq->service->id,
                    'name' => $faq->service->name,
                    'slug' => $faq->service->slug,
                ],
            ]);

        return Inertia::render('admin/faqs/index', [
            'faqs' => $faqs,
            'search' => $search,
            'services' => Service::query()->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function index(Request $request, Service $service): Response
    {
        $search = $request->string('search')->trim()->toString();
        $faqs = $service->faqs()
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('question', 'like', "%{$search}%")
                        ->orWhere('answer', 'like', "%{$search}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Faq $faq): array => [
                'id' => $faq->id,
                'serviceId' => $service->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'answerPreview' => Str::limit($faq->answer, 120),
                'isActive' => $faq->is_active,
                'sortOrder' => $faq->sort_order,
            ]);

        return Inertia::render('admin/services/faqs/index', [
            'service' => ['id' => $service->id, 'name' => $service->name, 'slug' => $service->slug],
            'faqs' => $faqs,
            'search' => $search,
        ]);
    }

    public function create(Service $service): Response
    {
        return Inertia::render('admin/services/faqs/create', [
            'service' => ['id' => $service->id, 'name' => $service->name, 'slug' => $service->slug],
            'faq' => null,
        ]);
    }

    public function store(StoreFaqRequest $request, Service $service): RedirectResponse
    {
        $service->faqs()->create($request->validated());

        return back();
    }

    public function edit(Service $service, Faq $faq): Response
    {
        return Inertia::render('admin/services/faqs/edit', [
            'service' => ['id' => $service->id, 'name' => $service->name, 'slug' => $service->slug],
            'faq' => [
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'isActive' => $faq->is_active,
                'sortOrder' => $faq->sort_order,
            ],
        ]);
    }

    public function update(UpdateFaqRequest $request, Service $service, Faq $faq): RedirectResponse
    {
        $faq->update($request->validated());

        return back();
    }

    public function destroy(Service $service, Faq $faq): RedirectResponse
    {
        $faq->delete();

        return back();
    }
}
