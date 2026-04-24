<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display transaction history for the authenticated user.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $filter = $request->input('filter', 'all');

        $query = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        if ($filter === 'income') {
            $query->income();
        } elseif ($filter === 'expense') {
            $query->expense();
        }

        $transactions = $query->paginate(20)->withQueryString();

        // Calculate summary totals
        $totalIncome = Transaction::where('user_id', $user->id)->income()->sum('amount');
        $totalExpense = Transaction::where('user_id', $user->id)->expense()->sum('amount');

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'summary' => [
                'balance' => (float) $user->balance,
                'formatted_balance' => 'Rp ' . number_format($user->balance, 0, ',', '.'),
                'total_income' => (float) $totalIncome,
                'formatted_income' => 'Rp ' . number_format($totalIncome, 0, ',', '.'),
                'total_expense' => (float) $totalExpense,
                'formatted_expense' => 'Rp ' . number_format($totalExpense, 0, ',', '.'),
            ],
            'currentFilter' => $filter,
        ]);
    }
}
