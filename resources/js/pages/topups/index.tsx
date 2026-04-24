import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, Eye, Loader2, ArrowLeft } from 'lucide-react';

interface Topup {
    id: number;
    amount: string;
    payment_method: string;
    status: 'pending' | 'paid' | 'expired' | 'failed';
    reference_number: string;
    created_at: string;
    paid_at: string | null;
    formatted_amount: string;
    payment_method_name: string;
}

interface PaginatedData {
    data: Topup[];
    current_page: number;
    last_page: number;
}

interface Props {
    topups: PaginatedData;
}

const statusConfig = {
    pending: {
        label: 'Menunggu',
        icon: Loader2,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        spin: true,
    },
    paid: {
        label: 'Berhasil',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        spin: false,
    },
    expired: {
        label: 'Kadaluarsa',
        icon: AlertCircle,
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        spin: false,
    },
    failed: {
        label: 'Gagal',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        spin: false,
    },
};

export default function TopupsIndex({ topups }: Props) {
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
            <Head title="Riwayat Top Up" />

            <div className="p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Riwayat Top Up
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Pantau status top up saldo Anda
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/topups/create"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-xl transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Top Up
                    </Link>
                </div>

                {/* Table */}
                {topups.data.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <Clock className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Belum ada top up
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Anda belum pernah melakukan top up saldo
                        </p>
                        <Link
                            href="/topups/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Top Up Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            No. Referensi
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Nominal
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Metode
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {topups.data.map((item) => {
                                        const status = statusConfig[item.status];
                                        const StatusIcon = status.icon;

                                        return (
                                            <tr 
                                                key={item.id} 
                                                className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                                                        {item.reference_number}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {item.formatted_amount}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {item.payment_method_name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                        <StatusIcon className={`w-3.5 h-3.5 ${status.spin ? 'animate-spin' : ''}`} />
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(item.created_at)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={`/topups/${item.id}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Lihat
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {topups.last_page > 1 && (
                            <div className="flex justify-center gap-2 py-4 border-t border-gray-200 dark:border-gray-700">
                                {Array.from({ length: topups.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/topups?page=${page}`}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                                            page === topups.current_page
                                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
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
