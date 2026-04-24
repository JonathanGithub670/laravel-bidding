import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDownRight,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    ArrowRight,
    Plus,
    AlertCircle,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface BankAccount {
    id: number;
    bank_name: string;
    account_number: string;
    account_name: string;
}

interface Disbursement {
    id: number;
    amount: string;
    fee: string;
    total: string;
    status:
        | 'pending'
        | 'approved'
        | 'processing'
        | 'completed'
        | 'failed'
        | 'rejected';
    reference_number: string;
    notes: string | null;
    admin_notes: string | null;
    created_at: string;
    approved_at: string | null;
    completed_at: string | null;
    bank_account: BankAccount;
    formatted_amount: string;
    formatted_fee: string;
    formatted_total: string;
}

interface PaginatedData {
    data: Disbursement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    disbursements: PaginatedData;
}

const statusConfig = {
    pending: {
        label: 'Menunggu',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        iconColor: 'text-yellow-500',
    },
    approved: {
        label: 'Disetujui',
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        iconColor: 'text-blue-500',
    },
    processing: {
        label: 'Diproses',
        icon: Loader2,
        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        iconColor: 'text-indigo-500',
        spin: true,
    },
    completed: {
        label: 'Selesai',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        iconColor: 'text-green-500',
    },
    failed: {
        label: 'Gagal',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        iconColor: 'text-red-500',
    },
    rejected: {
        label: 'Ditolak',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        iconColor: 'text-red-500',
    },
};

export default function DisbursementsIndex({ disbursements }: Props) {
    const handleCancel = (id: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan penarikan ini?')) {
            router.post(`/disbursements/${id}/cancel`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <Head title="Riwayat Penarikan" />

            <div className="mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Riwayat Penarikan
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Pantau status penarikan saldo Anda
                        </p>
                    </div>
                    <Link
                        href="/disbursements/create"
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-violet-500/25 transition-colors hover:from-violet-700 hover:to-purple-700"
                    >
                        <Plus className="h-5 w-5" />
                        Tarik Dana
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="mb-6 flex gap-3">
                    <Link
                        href="/bank-accounts"
                        className="flex flex-1 items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-violet-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-violet-700"
                    >
                        <span className="text-gray-700 dark:text-gray-300">
                            Kelola Rekening Bank
                        </span>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                    </Link>
                </div>

                {/* Disbursement List */}
                {disbursements.data.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                        <ArrowDownRight className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                            Belum ada penarikan
                        </h3>
                        <p className="mb-6 text-gray-500 dark:text-gray-400">
                            Anda belum pernah melakukan penarikan dana
                        </p>
                        <Link
                            href="/disbursements/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-700"
                        >
                            <Plus className="h-5 w-5" />
                            Tarik Dana Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {disbursements.data.map((item) => {
                            const status = statusConfig[item.status];
                            const StatusIcon = status.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`rounded-lg p-2 ${status.color}`}
                                            >
                                                <StatusIcon
                                                    className={`h-5 w-5 ${'spin' in status && status.spin ? 'animate-spin' : ''}`}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {item.formatted_amount}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {item.reference_number}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Bank Tujuan
                                            </p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {item.bank_account.bank_name}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {
                                                    item.bank_account
                                                        .account_number
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Yang Diterima
                                            </p>
                                            <p className="font-medium text-green-600 dark:text-green-400">
                                                {item.formatted_total}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                (Biaya: {item.formatted_fee})
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(item.created_at)}
                                        </p>
                                        {item.status === 'pending' && (
                                            <button
                                                onClick={() =>
                                                    handleCancel(item.id)
                                                }
                                                className="text-sm font-medium text-red-600 hover:text-red-700"
                                            >
                                                Batalkan
                                            </button>
                                        )}
                                        {item.admin_notes &&
                                            item.status === 'rejected' && (
                                                <div className="flex items-center gap-1 text-sm text-red-600">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {item.admin_notes}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Pagination */}
                        {disbursements.last_page > 1 && (
                            <div className="flex justify-center gap-2 pt-4">
                                {Array.from(
                                    { length: disbursements.last_page },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/disbursements?page=${page}`}
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-colors ${
                                            page === disbursements.current_page
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
