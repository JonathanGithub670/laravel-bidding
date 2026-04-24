import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowDownRight, Clock, CheckCircle, XCircle, Loader2, ArrowRight, Plus, AlertCircle } from 'lucide-react';

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
    status: 'pending' | 'approved' | 'processing' | 'completed' | 'failed' | 'rejected';
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

            <div className="p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Riwayat Penarikan
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Pantau status penarikan saldo Anda
                        </p>
                    </div>
                    <Link
                        href="/disbursements/create"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-violet-500/25"
                    >
                        <Plus className="w-5 h-5" />
                        Tarik Dana
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="flex gap-3 mb-6">
                    <Link
                        href="/bank-accounts"
                        className="flex-1 flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                    >
                        <span className="text-gray-700 dark:text-gray-300">Kelola Rekening Bank</span>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                    </Link>
                </div>

                {/* Disbursement List */}
                {disbursements.data.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <ArrowDownRight className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Belum ada penarikan
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Anda belum pernah melakukan penarikan dana
                        </p>
                        <Link
                            href="/disbursements/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors"
                        >
                            <Plus className="w-5 h-5" />
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
                                    className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${status.color}`}>
                                                <StatusIcon className={`w-5 h-5 ${'spin' in status && status.spin ? 'animate-spin' : ''}`} />
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Bank Tujuan</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {item.bank_account.bank_name}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {item.bank_account.account_number}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Yang Diterima</p>
                                            <p className="font-medium text-green-600 dark:text-green-400">
                                                {item.formatted_total}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                                                (Biaya: {item.formatted_fee})
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(item.created_at)}
                                        </p>
                                        {item.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(item.id)}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Batalkan
                                            </button>
                                        )}
                                        {item.admin_notes && item.status === 'rejected' && (
                                            <div className="flex items-center gap-1 text-sm text-red-600">
                                                <AlertCircle className="w-4 h-4" />
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
                                {Array.from({ length: disbursements.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/disbursements?page=${page}`}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                                            page === disbursements.current_page
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
