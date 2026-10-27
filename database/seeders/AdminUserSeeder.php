<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (! app()->isLocal()) {
            return;
        }

        $user = User::query()->where('email', 'admin@legalpartner.id')->first()
            ?? User::query()->where('email', 'admin@legalpartner.test')->first();

        if ($user === null) {
            $user = User::query()->create([
                'email' => 'admin@legalpartner.id',
                'name' => 'Admin LegalPartner',
                'password' => 'password',
            ]);
        }

        $user->forceFill([
            'email' => 'admin@legalpartner.id',
            'email_verified_at' => $user->email_verified_at ?? now(),
        ])->save();
    }
}
