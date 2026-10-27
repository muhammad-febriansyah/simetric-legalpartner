<?php

namespace App\Notifications;

use App\Models\PartnershipApplication;
use Illuminate\Notifications\Notification;

class PartnershipApplicationReceived extends Notification
{
    /**
     * Create a notification for a newly submitted partnership application.
     */
    public function __construct(public PartnershipApplication $application) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Pendaftar mitra baru',
            'description' => $this->application->full_name,
            'category' => 'partnership_application',
            'categoryLabel' => PartnershipApplication::TYPES[$this->application->partnership_type]
                ?? $this->application->partnership_type,
            'partnershipApplicationId' => $this->application->id,
        ];
    }
}
