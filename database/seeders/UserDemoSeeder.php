<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserDemoSeeder extends Seeder
{
    /**
     * Seed team members who can sign in to the admin panel (password: "password").
     */
    public function run(): void
    {
        $team = [
            'Rahma Pratiwi', 'Dimas Aryanto', 'Nadia Kusuma', 'Bima Santoso', 'Sari Wulandari',
            'Andi Firmansyah', 'Maya Puspita', 'Rudi Hartono', 'Intan Permata', 'Eko Prasetyo',
            'Fitri Ramadhani', 'Galih Pangestu', 'Lia Anggraeni', 'Hadi Nugraha', 'Citra Dewanti',
            'Wahyu Saputra', 'Yuni Safitri', 'Rafi Mahendra', 'Tika Maulida',
        ];

        foreach ($team as $name) {
            $email = str($name)->lower()->slug('.')->append('@legalpartner.id')->toString();

            $user = User::query()->firstOrNew(['email' => $email]);

            if (! $user->exists) {
                $user->forceFill(['name' => $name, 'password' => 'password']);
            }

            $user->forceFill(['email_verified_at' => $user->email_verified_at ?? now()])->save();
        }
    }
}
