<?php

namespace App\Models;

use Database\Factories\PartnershipApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'full_name',
    'whatsapp',
    'email',
    'partnership_type',
    'message',
    'status',
    'admin_notes',
])]
class PartnershipApplication extends Model
{
    /** @use HasFactory<PartnershipApplicationFactory> */
    use HasFactory;

    public const STATUS_NEW = 'new';

    public const STATUS_CONTACTED = 'contacted';

    public const STATUS_IN_REVIEW = 'in_review';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_NEW,
        self::STATUS_CONTACTED,
        self::STATUS_IN_REVIEW,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
    ];

    /** @var array<string, string> */
    public const TYPES = [
        'notaris-ppat' => 'Notaris & PPAT',
        'virtual-office' => 'Virtual office',
        'agen-reseller' => 'Agen & referral',
    ];
}
