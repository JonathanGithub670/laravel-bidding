<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Reimbursement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class UserInvoiceController extends Controller
{
    /**
     * Display a listing of all user's invoices (winning auctions + reimbursements).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $type = $request->get('type', 'all');

        // Get auction invoices (from winning auctions)
        $invoices = Invoice::with(['auction', 'winner'])
            ->where('winner_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($inv) => [
                'id' => $inv->uuid,
                'type' => 'invoice',
                'reference' => $inv->invoice_number,
                'title' => $inv->auction?->title ?? 'Lelang',
                'description' => 'Tagihan Pemenang Lelang',
                'amount' => $inv->total_amount,
                'formatted_amount' => $inv->formatted_total,
                'status' => $inv->status,
                'status_label' => match ($inv->status) {
                    'pending' => 'Menunggu Pembayaran',
                    'paid' => 'Lunas',
                    'expired' => 'Kadaluarsa',
                    default => ucfirst($inv->status),
                },
                'status_color' => match ($inv->status) {
                    'pending' => 'yellow',
                    'paid' => 'green',
                    'expired' => 'red',
                    default => 'gray',
                },
                'created_at' => $inv->created_at->toISOString(),
                'due_at' => $inv->payment_due_at?->toISOString(),
            ]);

        // Get reimbursement records
        $reimbursements = Reimbursement::with(['auction'])
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($rmb) => [
                'id' => $rmb->uuid,
                'type' => 'reimbursement',
                'reference' => $rmb->reference_number,
                'title' => $rmb->auction?->title ?? 'Lelang',
                'description' => 'Pengembalian Biaya Pendaftaran',
                'amount' => $rmb->amount,
                'formatted_amount' => $rmb->formatted_amount,
                'status' => $rmb->status,
                'status_label' => match ($rmb->status) {
                    'pending' => 'Menunggu',
                    'eligible' => 'Eligible',
                    'approved' => 'Disetujui',
                    'completed' => 'Dana Dikembalikan',
                    'rejected' => 'Ditolak',
                    default => ucfirst($rmb->status),
                },
                'status_color' => match ($rmb->status) {
                    'pending' => 'yellow',
                    'eligible' => 'blue',
                    'approved' => 'indigo',
                    'completed' => 'green',
                    'rejected' => 'red',
                    default => 'gray',
                },
                'created_at' => $rmb->created_at->toISOString(),
                'due_at' => null,
            ]);

        // Combine and sort
        $allItems = $invoices->merge($reimbursements)->sortByDesc('created_at')->values();

        // Filter by type
        if ($type === 'invoice') {
            $allItems = $allItems->where('type', 'invoice')->values();
        } elseif ($type === 'reimbursement') {
            $allItems = $allItems->where('type', 'reimbursement')->values();
        }

        $counts = [
            'all' => $invoices->count() + $reimbursements->count(),
            'invoice' => $invoices->count(),
            'reimbursement' => $reimbursements->count(),
        ];

        return Inertia::render('user/invoices/index', [
            'items' => $allItems,
            'counts' => $counts,
            'currentType' => $type,
        ]);
    }

    /**
     * Display invoice detail as a "surat" (letter-style document).
     */
    public function show(Request $request, string $type, string $uuid): Response
    {
        $user = $request->user();

        if ($type === 'invoice') {
            $invoice = Invoice::with(['auction.category', 'auction.seller', 'winner'])
                ->where('winner_id', $user->id)
                ->where('uuid', $uuid)
                ->firstOrFail();

            $data = [
                'type' => 'invoice',
                'reference' => $invoice->invoice_number,
                'title' => 'Tagihan Pemenang Lelang',
                'auction_title' => $invoice->auction?->title,
                'auction_category' => $invoice->auction?->category?->name,
                'seller_name' => $invoice->auction?->seller?->name,
                'winner_name' => $invoice->winner?->name,
                'amount' => $invoice->amount,
                'admin_fee' => $invoice->admin_fee,
                'registration_fee' => $invoice->registration_fee,
                'app_fee' => $invoice->app_fee,
                'total_amount' => $invoice->total_amount,
                'formatted_amount' => 'Rp ' . number_format($invoice->amount, 0, ',', '.'),
                'formatted_admin_fee' => 'Rp ' . number_format($invoice->admin_fee, 0, ',', '.'),
                'formatted_registration_fee' => 'Rp ' . number_format($invoice->registration_fee, 0, ',', '.'),
                'formatted_app_fee' => 'Rp ' . number_format($invoice->app_fee, 0, ',', '.'),
                'formatted_total' => $invoice->formatted_total,
                'status' => $invoice->status,
                'status_label' => match ($invoice->status) {
                    'pending' => 'Menunggu Pembayaran',
                    'paid' => 'Lunas',
                    'expired' => 'Kadaluarsa',
                    default => ucfirst($invoice->status),
                },
                'status_color' => match ($invoice->status) {
                    'pending' => 'yellow',
                    'paid' => 'green',
                    'expired' => 'red',
                    default => 'gray',
                },
                'created_at' => $invoice->created_at->toISOString(),
                'due_at' => $invoice->payment_due_at?->toISOString(),
                'paid_at' => $invoice->paid_at?->toISOString(),
            ];
        } else {
            $reimbursement = Reimbursement::with(['auction.category', 'auction.seller', 'user'])
                ->where('user_id', $user->id)
                ->where('uuid', $uuid)
                ->firstOrFail();

            $data = [
                'type' => 'reimbursement',
                'reference' => $reimbursement->reference_number,
                'title' => 'Surat Pengembalian Biaya Pendaftaran',
                'auction_title' => $reimbursement->auction?->title,
                'auction_category' => $reimbursement->auction?->category?->name,
                'seller_name' => $reimbursement->auction?->seller?->name,
                'winner_name' => $reimbursement->user?->name,
                'amount' => $reimbursement->amount,
                'admin_fee' => 0,
                'total_amount' => $reimbursement->amount,
                'formatted_amount' => $reimbursement->formatted_amount,
                'formatted_admin_fee' => 'Rp 0',
                'formatted_total' => $reimbursement->formatted_amount,
                'status' => $reimbursement->status,
                'status_label' => match ($reimbursement->status) {
                    'pending' => 'Menunggu',
                    'eligible' => 'Eligible',
                    'approved' => 'Disetujui',
                    'completed' => 'Dana Dikembalikan',
                    'rejected' => 'Ditolak',
                    default => ucfirst($reimbursement->status),
                },
                'status_color' => match ($reimbursement->status) {
                    'pending' => 'yellow',
                    'eligible' => 'blue',
                    'approved' => 'indigo',
                    'completed' => 'green',
                    'rejected' => 'red',
                    default => 'gray',
                },
                'created_at' => $reimbursement->created_at->toISOString(),
                'due_at' => null,
                'paid_at' => $reimbursement->completed_at?->toISOString(),
            ];
        }

        return Inertia::render('user/invoices/show', [
            'document' => $data,
        ]);
    }

    /**
     * Download invoice as PDF.
     */
    public function download(Request $request, string $type, string $uuid)
    {
        $user = $request->user();

        if ($type === 'invoice') {
            $invoice = Invoice::with(['auction.category', 'auction.seller', 'winner'])
                ->where('winner_id', $user->id)
                ->where('uuid', $uuid)
                ->firstOrFail();

            $data = [
                'type' => 'invoice',
                'reference' => $invoice->invoice_number,
                'title' => 'Tagihan Pemenang Lelang',
                'auction_title' => $invoice->auction?->title,
                'auction_category' => $invoice->auction?->category?->name,
                'seller_name' => $invoice->auction?->seller?->name,
                'winner_name' => $invoice->winner?->name,
                'amount' => $invoice->amount,
                'admin_fee' => $invoice->admin_fee,
                'registration_fee' => $invoice->registration_fee,
                'app_fee' => $invoice->app_fee,
                'total_amount' => $invoice->total_amount,
                'formatted_amount' => 'Rp ' . number_format($invoice->amount, 0, ',', '.'),
                'formatted_admin_fee' => 'Rp ' . number_format($invoice->admin_fee, 0, ',', '.'),
                'formatted_registration_fee' => 'Rp ' . number_format($invoice->registration_fee, 0, ',', '.'),
                'formatted_app_fee' => 'Rp ' . number_format($invoice->app_fee, 0, ',', '.'),
                'formatted_total' => $invoice->formatted_total,
                'status' => $invoice->status,
                'status_label' => match ($invoice->status) {
                    'pending' => 'Menunggu Pembayaran',
                    'paid' => 'Lunas',
                    'expired' => 'Kadaluarsa',
                    default => ucfirst($invoice->status),
                },
                'status_color' => match ($invoice->status) {
                    'pending' => 'yellow',
                    'paid' => 'green',
                    'expired' => 'red',
                    default => 'gray',
                },
                'created_at' => $invoice->created_at->toISOString(),
                'due_at' => $invoice->payment_due_at?->toISOString(),
                'paid_at' => $invoice->paid_at?->toISOString(),
            ];
        } else {
            $reimbursement = Reimbursement::with(['auction.category', 'auction.seller', 'user'])
                ->where('user_id', $user->id)
                ->where('uuid', $uuid)
                ->firstOrFail();

            $data = [
                'type' => 'reimbursement',
                'reference' => $reimbursement->reference_number,
                'title' => 'Surat Pengembalian Biaya Pendaftaran',
                'auction_title' => $reimbursement->auction?->title,
                'auction_category' => $reimbursement->auction?->category?->name,
                'seller_name' => $reimbursement->auction?->seller?->name,
                'winner_name' => $reimbursement->user?->name,
                'amount' => $reimbursement->amount,
                'admin_fee' => 0,
                'registration_fee' => 0,
                'total_amount' => $reimbursement->amount,
                'formatted_amount' => $reimbursement->formatted_amount,
                'formatted_admin_fee' => 'Rp 0',
                'formatted_registration_fee' => 'Rp 0',
                'formatted_app_fee' => 'Rp 0',
                'formatted_total' => $reimbursement->formatted_amount,
                'status' => $reimbursement->status,
                'status_label' => match ($reimbursement->status) {
                    'pending' => 'Menunggu',
                    'eligible' => 'Eligible',
                    'approved' => 'Disetujui',
                    'completed' => 'Dana Dikembalikan',
                    'rejected' => 'Ditolak',
                    default => ucfirst($reimbursement->status),
                },
                'status_color' => match ($reimbursement->status) {
                    'pending' => 'yellow',
                    'eligible' => 'blue',
                    'approved' => 'indigo',
                    'completed' => 'green',
                    'rejected' => 'red',
                    default => 'gray',
                },
                'created_at' => $reimbursement->created_at->toISOString(),
                'due_at' => null,
                'paid_at' => $reimbursement->completed_at?->toISOString(),
            ];
        }

        // Embed logo as base64 for PDF
        $logoPath = public_path('Logo.png');
        $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));

        $pdf = Pdf::loadView('pdf.invoice', [
            'doc' => $data,
            'logoBase64' => $logoBase64,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->download($data['reference'] . '.pdf');
    }
}
