<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePartnershipApplicationRequest;
use App\Models\PartnershipApplication;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PartnershipApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->toString();
        $type = $request->string('type')->toString();
        $status = in_array($status, PartnershipApplication::STATUSES, true) ? $status : '';
        $type = array_key_exists($type, PartnershipApplication::TYPES) ? $type : '';

        $applications = PartnershipApplication::query()
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('full_name', 'like', "%{$search}%")
                        ->orWhere('whatsapp', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', fn (Builder $query) => $query->where('status', $status))
            ->when($type !== '', fn (Builder $query) => $query->where('partnership_type', $type))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (PartnershipApplication $application): array => [
                'id' => $application->id,
                'fullName' => $application->full_name,
                'whatsapp' => $application->whatsapp,
                'email' => $application->email,
                'type' => $application->partnership_type,
                'typeLabel' => PartnershipApplication::TYPES[$application->partnership_type],
                'message' => $application->message,
                'status' => $application->status,
                'adminNotes' => $application->admin_notes,
                'createdAt' => $application->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/partnership-applications/index', [
            'applications' => $applications,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'type' => $type,
            ],
            'statuses' => PartnershipApplication::STATUSES,
            'types' => PartnershipApplication::TYPES,
        ]);
    }

    public function update(UpdatePartnershipApplicationRequest $request, PartnershipApplication $partnershipApplication): RedirectResponse
    {
        $partnershipApplication->update($request->validated());

        return back()->with('success', 'Pendaftaran mitra berhasil diperbarui.');
    }
}
