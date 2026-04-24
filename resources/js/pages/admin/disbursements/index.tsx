import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowDownRight,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    Check,
    X,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
}

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
    user: User;
    bank_account: BankAccount;
    processed_by_user: User | null;
    formatted_amount: string;
    formatted_fee: string;
    formatted_total: string;
}

interface PaginatedData {
    data: Disbursement[];
    current_page: number;
    last_page: number;
}

interface Props {
    disbursements: PaginatedData;
    counts: Record<string, number>;
    currentStatus: string;
}

const statusConfig = {
    pending: {
        label: 'Menunggu',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    approved: {
        label: 'Disetujui',
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    processing: {
        label: 'Diproses',
        icon: Loader2,
        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    completed: {
        label: 'Selesai',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    failed: {
        label: 'Gagal',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    rejected: {
        label: 'Ditolak',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
};

export default function AdminDisbursementsIndex({
    disbursements,
    counts,
    currentStatus,
}: Props) {
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const rejectForm = useForm({ reason: '' });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleApprove = (id: number) => {
        if (confirm('Approve dan proses disbursement ini?')) {
            router.post(`/admin/disbursements/${id}/approve`);
        }
    };

    const handleReject = (id: number) => {
        rejectForm.post(`/admin/disbursements/${id}/reject`, {
            onSuccess: () => {
                setRejectingId(null);
                rejectForm.reset();
            },
        });
    };

    const tabs = [
        { key: 'all', label: 'Semua' },
        { key: 'pending', label: 'Menunggu' },
        { key: 'processing', label: 'Diproses' },
        { key: 'completed', label: 'Selesai' },
        { key: 'rejected', label: 'Ditolak' },
    ];

    return (
        <AppLayout>
            <Head title="Kelola Disbursement" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Kelola Disbursement
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Review dan approve permintaan penarikan dana
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                        <p className="text-2xl font-bold text-yellow-600">
                            {counts.pending}
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            Menunggu
                        </p>
                    </div>
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
                        <p className="text-2xl font-bold text-indigo-600">
                            {counts.processing}
                        </p>
                        <p className="text-sm text-indigo-700 dark:text-indigo-400">
                            Diproses
                        </p>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                        <p className="text-2xl font-bold text-green-600">
                            {counts.completed}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400">
                            Selesai
                        </p>
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <p className="text-2xl font-bold text-red-600">
                            {counts.rejected + counts.failed}
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-400">
                            Ditolak/Gagal
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 border-b border-gray-200 pb-4 dark:border-gray-700">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={`/admin/disbursements?status=${tab.key}`}
                            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                                currentStatus === tab.key
                                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                            }`}
                        >
                            {tab.label}
                            <span className="ml-2 text-xs">
                                ({counts[tab.key] || 0})
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Table */}
                {disbursements.data.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                        <ArrowDownRight className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                            Tidak ada data
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada disbursement dengan status ini
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                        Bank
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {disbursements.data.map((item) => {
                                    const status = statusConfig[item.status];

                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {item.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.user.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {item.formatted_amount}
                                                </p>
                                                <p className="text-xs text-green-600">
                                                    Diterima:{' '}
                                                    {item.formatted_total}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-900 dark:text-white">
                                                    {
                                                        item.bank_account
                                                            .bank_name
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {
                                                        item.bank_account
                                                            .account_number
                                                    }
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                                                >
                                                    <status.icon className="h-3.5 w-3.5" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.status === 'pending' ? (
                                                    rejectingId === item.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    rejectForm
                                                                        .data
                                                                        .reason
                                                                }
                                                                onChange={(e) =>
                                                                    rejectForm.setData(
                                                                        'reason',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Alasan penolakan"
                                                                className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700"
                                                            />
                                                            <button
                                                                onClick={() =>
                                                                    handleReject(
                                                                        item.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !rejectForm
                                                                        .data
                                                                        .reason
                                                                }
                                                                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setRejectingId(
                                                                        null,
                                                                    )
                                                                }
                                                                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setRejectingId(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="text-sm text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {disbursements.last_page > 1 && (
                            <div className="flex justify-center gap-2 border-t border-gray-100 p-4 dark:border-gray-700">
                                {Array.from(
                                    { length: disbursements.last_page },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/admin/disbursements?status=${currentStatus}&page=${page}`}
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                                            page === disbursements.current_page
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
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
