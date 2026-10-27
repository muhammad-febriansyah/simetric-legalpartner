<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot open user management', function () {
    $this->get(route('admin.users.index'))
        ->assertRedirect(route('login'));
});

test('admin can search users and identify the current account', function () {
    $user = User::factory()->create(['name' => 'Admin LegalPartner']);
    User::factory()->create(['name' => 'Support LegalPartner']);

    $this->actingAs($user)
        ->get(route('admin.users.index', ['search' => 'Admin']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->where('search', 'Admin')
            ->where('users.total', 1)
            ->where('users.data.0.name', 'Admin LegalPartner')
            ->where('users.data.0.isCurrentUser', true),
        );
});

test('admin can create another verified admin with a hashed password', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'Admin Baru',
            'email' => 'admin.baru@legalpartner.id',
            'password' => 'StrongPassword123!',
            'password_confirmation' => 'StrongPassword123!',
        ])
        ->assertRedirect(route('admin.users.index'));

    $createdUser = User::query()->where('email', 'admin.baru@legalpartner.id')->firstOrFail();

    expect($createdUser->email_verified_at)->not->toBeNull();
    expect(Hash::check('StrongPassword123!', $createdUser->password))->toBeTrue();
});

test('admin can update account details and replace password only when provided', function () {
    $admin = User::factory()->create();
    $managedUser = User::factory()->create([
        'name' => 'Admin Lama',
        'email' => 'admin.lama@legalpartner.id',
        'password' => 'OldPassword123!',
    ]);

    $this->actingAs($admin)
        ->put(route('admin.users.update', $managedUser), [
            'name' => 'Admin Baru',
            'email' => 'admin.baru@legalpartner.id',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])
        ->assertRedirect(route('admin.users.index'));

    $managedUser->refresh();

    expect($managedUser->name)->toBe('Admin Baru');
    expect($managedUser->email)->toBe('admin.baru@legalpartner.id');
    expect(Hash::check('NewPassword123!', $managedUser->password))->toBeTrue();
    expect($managedUser->email_verified_at)->not->toBeNull();
});

test('admin cannot delete the account currently in use', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->from(route('admin.users.index'))
        ->delete(route('admin.users.destroy', $admin))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHasErrors('user');

    $this->assertModelExists($admin);
});

test('admin can delete another account', function () {
    $admin = User::factory()->create();
    $managedUser = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $managedUser))
        ->assertRedirect(route('admin.users.index'));

    $this->assertModelMissing($managedUser);
});

test('admin user email must be unique', function () {
    $admin = User::factory()->create();
    User::factory()->create(['email' => 'existing@legalpartner.id']);

    $this->actingAs($admin)
        ->from(route('admin.users.index'))
        ->post(route('admin.users.store'), [
            'name' => 'Admin Duplikat',
            'email' => 'existing@legalpartner.id',
            'password' => 'StrongPassword123!',
            'password_confirmation' => 'StrongPassword123!',
        ])
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHasErrors('email');
});
