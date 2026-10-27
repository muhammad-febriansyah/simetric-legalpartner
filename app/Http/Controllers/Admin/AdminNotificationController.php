<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    public function markRead(Request $request, string $notification): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user instanceof User, 403);

        $user
            ->notifications()
            ->whereKey($notification)
            ->firstOrFail()
            ->markAsRead();

        return to_route('admin.partnership-applications.index', ['status' => 'new']);
    }
}
