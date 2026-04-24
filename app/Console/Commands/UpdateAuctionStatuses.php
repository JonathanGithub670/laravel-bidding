<?php

namespace App\Console\Commands;

use App\Jobs\ProcessAuctionEnd;
use App\Models\Auction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateAuctionStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auctions:update-statuses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update auction statuses based on start and end times';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for auction status updates...');

        // Start scheduled auctions that have reached their start time
        $auctionsToStart = Auction::where('status', 'scheduled')
            ->where('starts_at', '<=', now())
            ->get();

        foreach ($auctionsToStart as $auction) {
            $auction->update(['status' => 'live']);

            Log::info('Auction started automatically', [
                'auction_id' => $auction->id,
                'title' => $auction->title,
                'starts_at' => $auction->starts_at,
                'ends_at' => $auction->ends_at,
            ]);

            $this->line("✓ Started: {$auction->title} (ID: {$auction->id})");
        }

        // End live auctions that have reached their end time
        // Dispatch ProcessAuctionEnd job which handles:
        // - Setting status to 'ended' + winner
        // - Creating invoice
        // - Generating reimbursements
        // - Creating settlements
        $auctionsToEnd = Auction::where('status', 'live')
            ->where('ends_at', '<=', now())
            ->get();

        foreach ($auctionsToEnd as $auction) {
            ProcessAuctionEnd::dispatch($auction);

            Log::info('Auction end job dispatched', [
                'auction_id' => $auction->id,
                'title' => $auction->title,
            ]);

            $this->line("✓ End job dispatched: {$auction->title} (ID: {$auction->id})");
        }

        $totalUpdated = $auctionsToStart->count() + $auctionsToEnd->count();

        if ($totalUpdated === 0) {
            $this->info('No status updates needed.');
        } else {
            $this->info("Total auctions updated: {$totalUpdated}");
        }

        return Command::SUCCESS;
    }
}
