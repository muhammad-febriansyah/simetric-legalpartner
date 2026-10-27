<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePartnershipApplicationRequest;
use App\Models\PartnershipApplication;
use App\Models\User;
use App\Notifications\PartnershipApplicationReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class PartnershipApplicationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/partnership', [
            'partnershipTypes' => PartnershipApplication::TYPES,
        ]);
    }

    public function store(StorePartnershipApplicationRequest $request): RedirectResponse
    {
        $application = PartnershipApplication::query()->create($request->validated());

        Notification::send(
            User::query()->get(),
            new PartnershipApplicationReceived($application),
        );

        return back()->with('success', 'Pendaftaran kemitraan berhasil dikirim.');
    }
}
