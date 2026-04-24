<?php

namespace App\Notifications;

use App\Models\Auction;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InvoiceExpiredNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected Auction $auction,
        protected Invoice $invoice,
        protected bool $transferredToRunnerUp = false
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $message = $this->transferredToRunnerUp
            ? "Invoice {$this->invoice->invoice_number} telah kedaluwarsa. Lelang \"{$this->auction->title}\" dialihkan ke penawar berikutnya."
            : "Invoice {$this->invoice->invoice_number} telah kedaluwarsa untuk lelang \"{$this->auction->title}\".";

        return [
            'type' => 'invoice_expired',
            'icon' => '⏰',
            'title' => 'Invoice Kedaluwarsa',
            'message' => $message,
            'url' => '/user/invoices',
            'auction_id' => $this->auction->id,
            'invoice_id' => $this->invoice->id,
        ];
    }
}
