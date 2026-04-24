<?php

namespace App\Notifications;

use App\Models\Auction;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AuctionWonNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Auction $auction,
        public Invoice $invoice
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'auction_won',
            'icon' => '🏆',
            'title' => 'Selamat! Anda Memenangkan Lelang',
            'message' => "Anda memenangkan lelang \"{$this->auction->title}\" dengan harga {$this->invoice->formatted_amount}. Silahkan lakukan pembayaran.",
            'auction_id' => $this->auction->id,
            'auction_title' => $this->auction->title,
            'invoice_id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'url' => "/user/invoices",
        ];
    }
}
