<?php

use App\Jobs\CheckPaymentDeadline;
use App\Services\AuctionSettlementService;
use App\Services\ReimbursementService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule auction processing commands
// update-statuses handles both starting scheduled auctions AND ending live auctions
Schedule::command('auctions:update-statuses')->everyMinute();
Schedule::job(new CheckPaymentDeadline)->everyMinute();

// Mark pending reimbursements as eligible (after 3-day waiting period)
Schedule::call(function () {
    app(ReimbursementService::class)->markEligible();
})->hourly();

// Process scheduled auction settlement disbursements
Schedule::call(function () {
    app(AuctionSettlementService::class)->processScheduledDisbursements();
})->everyFiveMinutes();
