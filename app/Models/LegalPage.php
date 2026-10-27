<?php

namespace App\Models;

use Database\Factories\LegalPageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegalPage extends Model
{
    /** @use HasFactory<LegalPageFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['title', 'slug', 'content', 'status', 'sort_order', 'published_at'];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
