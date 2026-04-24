<?php

namespace App\Notifications;

use App\Models\Auction;
use App\Models\Reimbursement;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AuctionLostNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Auction $auction,
        public int $refundAmount
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $formattedAmount = 'Rp ' . number_format($this->refundAmount, 0, ',', '.');

        return [
            'type' => 'auction_lost',
            'icon' => '💰',
            'title' => 'Pengembalian Dana Lelang',
            'message' => "Lelang \"{$this->auction->title}\" telah berakhir. Dana deposit Anda sebesar {$formattedAmount} akan dikembalikan setelah diverifikasi admin.",
            'auction_id' => $this->auction->id,
            'auction_title' => $this->auction->title,
            'amount' => $this->refundAmount,
            'url' => "/user/reimbursements",
        ];
    }
}
