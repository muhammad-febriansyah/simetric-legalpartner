<?php

namespace App\Models;

use Database\Factories\KbliMappingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['source_kbli_id', 'target_kbli_id', 'relation_type', 'notes'])]
class KbliMapping extends Model
{
    /** @use HasFactory<KbliMappingFactory> */
    use HasFactory;

    /** @return BelongsTo<KbliCode, $this> */
    public function source(): BelongsTo
    {
        return $this->belongsTo(KbliCode::class, 'source_kbli_id');
    }

    /** @return BelongsTo<KbliCode, $this> */
    public function target(): BelongsTo
    {
        return $this->belongsTo(KbliCode::class, 'target_kbli_id');
    }
}
