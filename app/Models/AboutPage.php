<?php

namespace App\Models;

use Database\Factories\AboutPageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutPage extends Model
{
    /** @use HasFactory<AboutPageFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'title',
        'subtitle',
        'content',
        'banner_image_path',
        'vision',
        'mission',
        'process',
        'features',
        'status',
        'published_at',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
