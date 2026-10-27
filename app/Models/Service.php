<?php

namespace App\Models;

use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'service_category_id',
    'name',
    'slug',
    'excerpt',
    'description',
    'hero_image',
    'hero_image_alt',
    'requirements',
    'process_steps',
    'duration_label',
    'meta_title',
    'meta_description',
    'is_featured',
    'is_active',
    'sort_order',
])]
class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory;

    /** @return BelongsTo<ServiceCategory, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    /** @return HasMany<ServicePackage, $this> */
    public function packages(): HasMany
    {
        return $this->hasMany(ServicePackage::class);
    }

    /** @return HasMany<ServiceAddon, $this> */
    public function addons(): HasMany
    {
        return $this->hasMany(ServiceAddon::class);
    }

    /** @return HasMany<Faq, $this> */
    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class);
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'requirements' => 'array',
            'process_steps' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
