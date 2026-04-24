import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    ArrowLeft,
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
    TrendingUp,
    TrendingDown,
    Clock,
    Gavel,
    UserPlus,
    RefreshCcw,
    Banknote,
    ArrowLeftRight,
    CreditCard,
} from 'lucide-react';
import { useState } from 'react';

interface Transaction {
    id: number;
    type: string;
    amount: number;
    formatted_amount: string;
    description: string;
    category: 'income' | 'expense';
    created_at: string;
}

interface PaginatedData {
    data: Transaction[];
    current_page: number;
    last_page: number;
}

interface Summary {
    balance: number;
    formatted_balance: string;
    total_income: number;
    formatted_income: string;
    total_expense: number;
    formatted_expense: string;
}

interface Props {
    transactions: PaginatedData;
    summary: Summary;
    currentFilter: string;
}

const typeLabels: Record<string, string> = {
    topup: 'Top Up Saldo',
    registration_fee: 'Biaya Pendaftaran',
    registration_income: 'Pendapatan Pendaftaran',
    bid: 'Deposit Bid',
    bid_refund: 'Pengembalian Deposit',
    reimbursement: 'Reimbursement',
    settlement_seller: 'Pencairan Dana',
    settlement_refund: 'Pengembalian Dana',
    disbursement: 'Penarikan Saldo',
    disbursement_refund: 'Pembatalan Penarikan',
};

const typeIcons: Record<string, typeof Wallet> = {
    topup: CreditCard,
    registration_fee: UserPlus,
    registration_income: UserPlus,
    bid: Gavel,
    bid_refund: RefreshCcw,
    reimbursement: RefreshCcw,
    settlement_seller: Banknote,
    settlement_refund: RefreshCcw,
    disbursement: ArrowUpRight,
    disbursement_refund: RefreshCcw,
};

export default function TransactionsIndex({ transactions, summary, currentFilter }: Props) {
    const [filter, setFilter] = useState(currentFilter || 'all');

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        // Relative time for recent transactions
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredTransactions = transactions.data.filter((t) => {
        if (filter === 'all') return true;
        if (filter === 'income') return t.category === 'income';
        if (filter === 'expense') return t.category === 'expense';
        return true;
    });

    return (
        <AppLayout>
            <Head title="Riwayat Transaksi" />

            <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
                <div className="mx-auto max-w-2xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="-ml-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Riwayat Transaksi</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Semua aktivitas saldo Anda</p>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <div className="mb-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white dark:from-gray-800 dark:to-gray-900">
                        <div className="mb-2 flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-400">Saldo Saat Ini</span>
                        </div>
                        <p className="mb-6 text-3xl font-bold">{summary.formatted_balance}</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl bg-white/10 p-3">
                                <div className="mb-1 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                                    <span className="text-xs text-gray-400">Total Masuk</span>
                                </div>
                                <p className="font-semibold text-emerald-400">{summary.formatted_income}</p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-3">
                                <div className="mb-1 flex items-center gap-2">
                                    <TrendingDown className="h-4 w-4 text-red-400" />
                                    <span className="text-xs text-gray-400">Total Keluar</span>
                                </div>
                                <p className="font-semibold text-red-400">{summary.formatted_expense}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6 flex gap-2">
                        {[
                            { key: 'all', label: 'Semua' },
                            { key: 'income', label: 'Pemasukan' },
                            { key: 'expense', label: 'Pengeluaran' },
                        ].map((tab) => (
                            <Link
                                key={tab.key}
                                href={`/transactions?filter=${tab.key}`}
                                preserveState
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    filter === tab.key
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}
                                onClick={() => setFilter(tab.key)}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>

                    {/* Transaction List */}
                    {filteredTransactions.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                            <Clock className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                            <h3 className="mb-1 font-medium text-gray-900 dark:text-white">Belum ada transaksi</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {filter === 'income'
                                    ? 'Belum ada pemasukan'
                                    : filter === 'expense'
                                      ? 'Belum ada pengeluaran'
                                      : 'Transaksi akan muncul di sini'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTransactions.map((transaction) => {
                                const Icon = typeIcons[transaction.type] || ArrowLeftRight;
                                const isIncome = transaction.category === 'income';
                                return (
                                    <div
                                        key={`${transaction.type}-${transaction.id}`}
                                        className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div
                                                className={`rounded-xl p-2.5 ${
                                                    isIncome
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                                        : 'bg-red-100 dark:bg-red-900/30'
                                                }`}
                                            >
                                                {isIncome ? (
                                                    <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                                                ) : (
                                                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-gray-900 dark:text-white">
                                                    {transaction.description}
                                                </p>
                                                <div className="mt-0.5 flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            isIncome
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                        }`}
                                                    >
                                                        <Icon className="h-3 w-3" />
                                                        {typeLabels[transaction.type] || transaction.type}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {formatDate(transaction.created_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="text-right">
                                                <p
                                                    className={`font-semibold ${
                                                        isIncome ? 'text-emerald-600' : 'text-red-600'
                                                    }`}
                                                >
                                                    {isIncome ? '+' : '-'}
                                                    {transaction.formatted_amount}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {transactions.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {Array.from({ length: transactions.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`/transactions?filter=${filter}&page=${page}`}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                                        page === transactions.current_page
                                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="mt-8 flex gap-3">
                        <Link
                            href="/topups/create"
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                        >
                            <ArrowDownLeft className="h-5 w-5" />
                            Top Up
                        </Link>
                        <Link
                            href="/topups"
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Lihat Semua Top Up
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
