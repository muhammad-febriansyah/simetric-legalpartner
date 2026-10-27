<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminUserRequest;
use App\Http\Requests\Admin\UpdateAdminUserRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $currentUserId = $request->user()->id;

        $users = User::query()
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'isVerified' => $user->email_verified_at !== null,
                'createdAt' => $user->created_at?->toIso8601String(),
                'isCurrentUser' => $user->id === $currentUserId,
            ]);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'search' => $search,
        ]);
    }

    public function store(StoreAdminUserRequest $request): RedirectResponse
    {
        $user = User::query()->create($request->validated());
        $user->forceFill(['email_verified_at' => now()])->save();

        return to_route('admin.users.index');
    }

    public function update(UpdateAdminUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();
        $emailChanged = $user->email !== $validated['email'];
        $password = $validated['password'] ?? null;
        unset($validated['password']);

        if ($password !== null && $password !== '') {
            $validated['password'] = $password;
        }

        $user->update($validated);

        if ($emailChanged) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        return to_route('admin.users.index');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            return back()->withErrors([
                'user' => 'Akun yang sedang digunakan tidak dapat dihapus.',
            ]);
        }

        $user->delete();

        return to_route('admin.users.index');
    }
}
