<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Enable broadcasting auth routes for private channels
Broadcast::routes(['middleware' => ['web', 'auth']]);

// OTP Routes (public, for registration)
Route::post('/otp/send', [\App\Http\Controllers\OtpController::class, 'send'])->name('otp.send');
Route::post('/otp/verify', [\App\Http\Controllers\OtpController::class, 'verify'])->name('otp.verify');

Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('dashboard', function () {
    $user = auth()->user();
    return Inertia::render('dashboard', [
        'balance' => (float) $user->balance,
        'formattedBalance' => 'Rp ' . number_format($user->balance, 0, ',', '.'),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Chat routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('chat', [ChatController::class, 'index'])->name('chat');
    Route::get('chat/{chat}/messages', [ChatController::class, 'getMessages'])->name('chat.messages');
    Route::post('chat/{chat}/messages', [ChatController::class, 'sendMessage'])->name('chat.send');
    Route::post('chat/create', [ChatController::class, 'createChat'])->name('chat.create');
    Route::post('chat/search-by-pin', [ChatController::class, 'searchByPin'])->name('chat.searchByPin');
    Route::post('chat/start-admin-chat', [ChatController::class, 'startAdminChat'])->name('chat.startAdminChat');
    Route::delete('chat/{chat}', [ChatController::class, 'destroy'])->name('chat.destroy');
});

// My Auctions routes (user submissions)
Route::middleware(['auth', 'verified'])->prefix('my-auctions')->group(function () {
    Route::get('/', [\App\Http\Controllers\MyAuctionController::class, 'index'])->name('my-auctions.index');
    Route::get('/create', [\App\Http\Controllers\MyAuctionController::class, 'create'])->name('my-auctions.create');
    Route::post('/', [\App\Http\Controllers\MyAuctionController::class, 'store'])->name('my-auctions.store');
    Route::post('/categories', [\App\Http\Controllers\MyAuctionController::class, 'storeCategory'])->name('my-auctions.categories.store');

    // Seller settlement routes (my sold items)
    Route::get('/settlements', [\App\Http\Controllers\SellerSettlementController::class, 'index'])->name('seller.settlements.index');
    Route::post('/settlements/{settlement}/confirm-shipping', [\App\Http\Controllers\SellerSettlementController::class, 'confirmShipping'])->name('seller.settlements.confirm-shipping');

    // Wildcard route must be last to avoid catching static paths
    Route::get('/{auction}', [\App\Http\Controllers\MyAuctionController::class, 'show'])->name('my-auctions.show');
});

// Admin routes (for admin and superadmin)
Route::middleware(['auth', 'verified', 'role:superadmin,admin'])->prefix('admin')->group(function () {
    // User verification routes (superadmin only)
    Route::middleware('role:superadmin')->prefix('users')->group(function () {
        Route::get('/verification', [\App\Http\Controllers\Admin\UserVerificationController::class, 'index'])->name('admin.users.verification');
        Route::post('/{user}/approve', [\App\Http\Controllers\Admin\UserVerificationController::class, 'approve'])->name('admin.users.approve');
        Route::post('/{user}/reject', [\App\Http\Controllers\Admin\UserVerificationController::class, 'reject'])->name('admin.users.reject');

        // Admin user management (superadmin only)
        Route::get('/admins', [\App\Http\Controllers\Admin\AdminUserController::class, 'index'])->name('admin.users.admins');
        Route::post('/admins', [\App\Http\Controllers\Admin\AdminUserController::class, 'store'])->name('admin.users.admins.store');
        Route::delete('/admins/{user}', [\App\Http\Controllers\Admin\AdminUserController::class, 'destroy'])->name('admin.users.admins.destroy');
        Route::post('/admins/{user}/reset-password', [\App\Http\Controllers\Admin\AdminUserController::class, 'resetPassword'])->name('admin.users.admins.reset-password');
    });

    // Auction approval routes
    Route::get('/auctions/pending', [\App\Http\Controllers\Admin\AuctionApprovalController::class, 'index'])->name('admin.auctions.pending');
    Route::get('/auctions/history', [\App\Http\Controllers\Admin\AuctionApprovalController::class, 'history'])->name('admin.auctions.history');
    Route::get('/auctions/{auction}/review', [\App\Http\Controllers\Admin\AuctionApprovalController::class, 'show'])->name('admin.auctions.review');
    Route::post('/auctions/{auction}/approve', [\App\Http\Controllers\Admin\AuctionApprovalController::class, 'approve'])->name('admin.auctions.approve');
    Route::post('/auctions/{auction}/reject', [\App\Http\Controllers\Admin\AuctionApprovalController::class, 'reject'])->name('admin.auctions.reject');
    // GET fallbacks — redirect to pending list if accessed via browser
    Route::get('/auctions/{auction}/approve', fn() => redirect()->route('admin.auctions.pending'));
    Route::get('/auctions/{auction}/reject', fn() => redirect()->route('admin.auctions.pending'));

    // Auction duration management routes
    Route::get('/durations', [\App\Http\Controllers\Admin\AuctionDurationController::class, 'index'])->name('admin.durations.index');
    Route::post('/durations', [\App\Http\Controllers\Admin\AuctionDurationController::class, 'store'])->name('admin.durations.store');
    Route::delete('/durations/{duration}', [\App\Http\Controllers\Admin\AuctionDurationController::class, 'destroy'])->name('admin.durations.destroy');

    // Category management routes
    Route::get('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'index'])->name('admin.categories.index');
    Route::get('/categories/create', [\App\Http\Controllers\Admin\CategoryController::class, 'create'])->name('admin.categories.create');
    Route::post('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'store'])->name('admin.categories.store');
    Route::get('/categories/{category}/edit', [\App\Http\Controllers\Admin\CategoryController::class, 'edit'])->name('admin.categories.edit');
    Route::put('/categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class, 'destroy'])->name('admin.categories.destroy');

    // Disbursement management routes
    Route::get('/disbursements', [\App\Http\Controllers\Admin\DisbursementController::class, 'index'])->name('admin.disbursements.index');
    Route::get('/disbursements/{disbursement}', [\App\Http\Controllers\Admin\DisbursementController::class, 'show'])->name('admin.disbursements.show');
    Route::post('/disbursements/{disbursement}/approve', [\App\Http\Controllers\Admin\DisbursementController::class, 'approve'])->name('admin.disbursements.approve');
    Route::post('/disbursements/{disbursement}/reject', [\App\Http\Controllers\Admin\DisbursementController::class, 'reject'])->name('admin.disbursements.reject');

    // Reimbursement management routes
    Route::get('/reimbursements', [\App\Http\Controllers\Admin\ReimbursementController::class, 'index'])->name('admin.reimbursements.index');
    Route::post('/reimbursements/{reimbursement}/approve', [\App\Http\Controllers\Admin\ReimbursementController::class, 'approve'])->name('admin.reimbursements.approve');
    Route::post('/reimbursements/{reimbursement}/reject', [\App\Http\Controllers\Admin\ReimbursementController::class, 'reject'])->name('admin.reimbursements.reject');

    // Auction settlement management routes
    Route::get('/settlements', [\App\Http\Controllers\Admin\AuctionSettlementController::class, 'index'])->name('admin.settlements.index');
    Route::post('/settlements/{settlement}/approve', [\App\Http\Controllers\Admin\AuctionSettlementController::class, 'approve'])->name('admin.settlements.approve');
    Route::post('/settlements/{settlement}/confirm-shipping', [\App\Http\Controllers\Admin\AuctionSettlementController::class, 'confirmShipping'])->name('admin.settlements.confirm-shipping');
    Route::post('/settlements/{settlement}/mark-delivered', [\App\Http\Controllers\Admin\AuctionSettlementController::class, 'markDelivered'])->name('admin.settlements.mark-delivered');
    Route::post('/settlements/{settlement}/reject', [\App\Http\Controllers\Admin\AuctionSettlementController::class, 'reject'])->name('admin.settlements.reject');
});

// Bank Account routes
Route::middleware(['auth', 'verified'])->prefix('bank-accounts')->group(function () {
    Route::get('/', [\App\Http\Controllers\BankAccountController::class, 'index'])->name('bank-accounts.index');
    Route::post('/', [\App\Http\Controllers\BankAccountController::class, 'store'])->name('bank-accounts.store');
    Route::put('/{bankAccount}', [\App\Http\Controllers\BankAccountController::class, 'update'])->name('bank-accounts.update');
    Route::delete('/{bankAccount}', [\App\Http\Controllers\BankAccountController::class, 'destroy'])->name('bank-accounts.destroy');
    Route::post('/{bankAccount}/set-primary', [\App\Http\Controllers\BankAccountController::class, 'setPrimary'])->name('bank-accounts.set-primary');
});

// Disbursement routes (user)
Route::middleware(['auth', 'verified'])->prefix('disbursements')->group(function () {
    Route::get('/', [\App\Http\Controllers\DisbursementController::class, 'index'])->name('disbursements.index');
    Route::get('/create', [\App\Http\Controllers\DisbursementController::class, 'create'])->name('disbursements.create');
    Route::post('/', [\App\Http\Controllers\DisbursementController::class, 'store'])->name('disbursements.store');
    Route::get('/{disbursement}', [\App\Http\Controllers\DisbursementController::class, 'show'])->name('disbursements.show');
    Route::post('/{disbursement}/cancel', [\App\Http\Controllers\DisbursementController::class, 'cancel'])->name('disbursements.cancel');
    Route::post('/fee-preview', [\App\Http\Controllers\DisbursementController::class, 'feePreview'])->name('disbursements.fee-preview');
});

// Top Up routes
Route::middleware(['auth', 'verified'])->prefix('topups')->group(function () {
    Route::get('/', [\App\Http\Controllers\TopupController::class, 'index'])->name('topups.index');
    Route::get('/create', [\App\Http\Controllers\TopupController::class, 'create'])->name('topups.create');
    Route::post('/', [\App\Http\Controllers\TopupController::class, 'store'])->name('topups.store');
    Route::get('/{topup}', [\App\Http\Controllers\TopupController::class, 'show'])->name('topups.show');
    Route::post('/{topup}/simulate', [\App\Http\Controllers\TopupController::class, 'simulatePayment'])->name('topups.simulate');
});

// Transaction history route
Route::get('transactions', [\App\Http\Controllers\TransactionController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('transactions.index');

// User invoice & reimbursement routes
Route::middleware(['auth', 'verified'])->prefix('user')->group(function () {
    Route::get('/invoices', [\App\Http\Controllers\UserInvoiceController::class, 'index'])->name('user.invoices.index');
    Route::get('/invoices/{type}/{uuid}', [\App\Http\Controllers\UserInvoiceController::class, 'show'])->name('user.invoices.show')
        ->where('type', 'invoice|reimbursement');
    Route::get('/invoices/{type}/{uuid}/download', [\App\Http\Controllers\UserInvoiceController::class, 'download'])->name('user.invoices.download')
        ->where('type', 'invoice|reimbursement');
    Route::get('/reimbursements', [\App\Http\Controllers\UserReimbursementController::class, 'index'])->name('user.reimbursements.index');
});

// Notification routes (API)
Route::middleware(['auth', 'verified'])->prefix('notifications')->group(function () {
    Route::get('/', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllRead'])->name('notifications.mark-all-read');
    Route::post('/{id}/mark-read', [\App\Http\Controllers\NotificationController::class, 'markRead'])->name('notifications.mark-read');
});



// Auction routes
Route::prefix('auctions')->group(function () {
    Route::get('/', fn() => redirect()->route('auctions.list'))->name('auctions.index');

    // Authenticated auction actions - including view detail
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/list', [\App\Http\Controllers\AuctionListController::class, 'index'])->name('auctions.list');
        Route::get('/{auction}', [\App\Http\Controllers\AuctionController::class, 'show'])
            ->name('auctions.show');
        Route::get('/create', [\App\Http\Controllers\AuctionController::class, 'create'])->name('auctions.create');
        Route::post('/', [\App\Http\Controllers\AuctionController::class, 'store'])->name('auctions.store');
        Route::post('/{auction}/bid', [\App\Http\Controllers\AuctionController::class, 'placeBid'])->name('auctions.bid');
        Route::post('/{auction}/register', [\App\Http\Controllers\AuctionController::class, 'register'])->name('auctions.register');
        Route::post('/{auction}/activity', [\App\Http\Controllers\AuctionActivityController::class, 'store'])->name('auctions.activity');
    });
});

require __DIR__ . '/settings.php';
