import { Head, Link } from '@inertiajs/react';
import {
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Loader2,
    ArrowLeft,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

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

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="-ml-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Riwayat Top Up
                            </h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                Pantau status top up saldo Anda
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/topups/create"
                        className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    >
                        <Plus className="h-5 w-5" />
                        Top Up
                    </Link>
                </div>

                {/* Table */}
                {topups.data.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                        <Clock className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                            Belum ada top up
                        </h3>
                        <p className="mb-6 text-gray-500 dark:text-gray-400">
                            Anda belum pernah melakukan top up saldo
                        </p>
                        <Link
                            href="/topups/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-colors dark:bg-white dark:text-gray-900"
                        >
                            <Plus className="h-5 w-5" />
                            Top Up Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            No. Referensi
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Nominal
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Metode
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {topups.data.map((item) => {
                                        const status =
                                            statusConfig[item.status];
                                        const StatusIcon = status.icon;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/30"
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
                                                        {
                                                            item.payment_method_name
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                                                    >
                                                        <StatusIcon
                                                            className={`h-3.5 w-3.5 ${status.spin ? 'animate-spin' : ''}`}
                                                        />
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(
                                                            item.created_at,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={`/topups/${item.id}`}
                                                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                                    >
                                                        <Eye className="h-4 w-4" />
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
                            <div className="flex justify-center gap-2 border-t border-gray-200 py-4 dark:border-gray-700">
                                {Array.from(
                                    { length: topups.last_page },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/topups?page=${page}`}
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-colors ${
                                            page === topups.current_page
                                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
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
