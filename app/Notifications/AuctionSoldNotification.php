<?php

namespace App\Notifications;

use App\Models\Auction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AuctionSoldNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Auction $auction,
        public int $finalPrice,
        public int $sellerAmount
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $formattedPrice = 'Rp ' . number_format($this->finalPrice, 0, ',', '.');
        $formattedSeller = 'Rp ' . number_format($this->sellerAmount, 0, ',', '.');

        return [
            'type' => 'auction_sold',
            'icon' => '📦',
            'title' => 'Barang Anda Berhasil Terjual!',
            'message' => "Barang \"{$this->auction->title}\" terjual seharga {$formattedPrice}. Anda akan menerima {$formattedSeller} setelah dikurangi biaya admin. Silahkan siapkan pengiriman.",
            'auction_id' => $this->auction->id,
            'auction_title' => $this->auction->title,
            'amount' => $this->finalPrice,
            'seller_amount' => $this->sellerAmount,
            'url' => "/my-auctions/settlements",
        ];
    }
}
