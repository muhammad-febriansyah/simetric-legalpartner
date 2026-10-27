<?php

namespace App\Models;

use Database\Factories\KbliCodeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['version', 'code', 'title', 'description', 'parent_code', 'search_keywords'])]
class KbliCode extends Model
{
    /** @use HasFactory<KbliCodeFactory> */
    use HasFactory;

    /** @return HasMany<KbliMapping, $this> */
    public function sourceMappings(): HasMany
    {
        return $this->hasMany(KbliMapping::class, 'source_kbli_id');
    }

    /** @return HasMany<KbliMapping, $this> */
    public function targetMappings(): HasMany
    {
        return $this->hasMany(KbliMapping::class, 'target_kbli_id');
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'version' => 'integer',
        ];
    }
}
