<?php

namespace App\Console\Commands;

use App\Jobs\ProcessAuctionEnd;
use App\Models\Auction;
use Illuminate\Console\Command;

class ProcessEndedAuctions extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'auctions:process-ended';

    /**
     * The console command description.
     */
    protected $description = 'Process auctions that have ended and determine winners';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $auctions = Auction::shouldEnd()->get();

        $count = $auctions->count();

        if ($count === 0) {
            $this->info('No auctions to process.');

            return Command::SUCCESS;
        }

        $this->info("Processing {$count} ended auction(s)...");

        foreach ($auctions as $auction) {
            $this->line("- Processing: {$auction->title} (ID: {$auction->id})");
            ProcessAuctionEnd::dispatch($auction);
        }

        $this->info('Done!');

        return Command::SUCCESS;
    }
}
