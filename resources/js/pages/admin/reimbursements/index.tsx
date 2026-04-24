import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    RefreshCcw,
    Clock,
    CheckCircle,
    XCircle,
    ShieldCheck,
    Timer,
    Check,
    X,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Auction {
    id: number;
    title: string;
    status: string;
    ends_at: string;
}

interface Participant {
    id: number;
    fee_paid: number;
    formatted_fee_paid: string;
}

interface Reimbursement {
    id: number;
    amount: number;
    status: 'pending' | 'eligible' | 'approved' | 'completed' | 'rejected';
    reference_number: string;
    admin_notes: string | null;
    eligible_at: string;
    approved_at: string | null;
    completed_at: string | null;
    created_at: string;
    formatted_amount: string;
    remaining_days: number;
    status_badge: { label: string; color: string };
    user: User;
    auction: Auction;
    participant: Participant;
    processed_by_user: User | null;
}

interface PaginatedData {
    data: Reimbursement[];
    current_page: number;
    last_page: number;
}

interface Props {
    reimbursements: PaginatedData;
    counts: Record<string, number>;
    currentStatus: string;
}

const statusConfig: Record<
    string,
    { label: string; icon: typeof Clock; color: string }
> = {
    pending: {
        label: 'Menunggu',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    eligible: {
        label: 'Eligible',
        icon: ShieldCheck,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    approved: {
        label: 'Disetujui',
        icon: CheckCircle,
        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    completed: {
        label: 'Selesai',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    rejected: {
        label: 'Ditolak',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
};

export default function AdminReimbursementsIndex({
    reimbursements,
    counts,
    currentStatus,
}: Props) {
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [approvingId, setApprovingId] = useState<number | null>(null);
    const [confirmApproveId, setConfirmApproveId] = useState<number | null>(
        null,
    );
    const rejectForm = useForm({ reason: '' });
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props as { flash: { success?: string; error?: string } };

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
        setApprovingId(id);
        setConfirmApproveId(null);
        router.post(
            `/admin/reimbursements/${id}/approve`,
            {},
            {
                onFinish: () => setApprovingId(null),
            },
        );
    };

    const handleReject = (id: number) => {
        rejectForm.post(`/admin/reimbursements/${id}/reject`, {
            onSuccess: () => {
                setRejectingId(null);
                rejectForm.reset();
            },
        });
    };

    const tabs = [
        { key: 'all', label: 'Semua' },
        { key: 'pending', label: 'Menunggu' },
        { key: 'eligible', label: 'Eligible' },
        { key: 'completed', label: 'Selesai' },
        { key: 'rejected', label: 'Ditolak' },
    ];

    const canApprove = (item: Reimbursement) => item.status === 'eligible';
    const canReject = (item: Reimbursement) =>
        item.status === 'pending' || item.status === 'eligible';

    return (
        <AppLayout>
            <Head title="Verifikasi Reimbursement" />

            <div className="p-6">
                {/* Approve Confirmation Modal */}
                {confirmApproveId !== null && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                            {/* Icon */}
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>

                            {/* Title */}
                            <h3 className="mb-2 text-center text-lg font-bold text-gray-900 dark:text-white">
                                Konfirmasi Persetujuan
                            </h3>

                            {/* Message */}
                            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
                                Setujui reimbursement ini? Dana akan
                                dikembalikan ke saldo user.
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmApproveId(null)}
                                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Tidak
                                </button>
                                <button
                                    onClick={() =>
                                        handleApprove(confirmApproveId)
                                    }
                                    className="flex-1 rounded-xl bg-green-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Setuju
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                            {flash.success}
                        </p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">
                            {flash.error}
                        </p>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Verifikasi Reimbursement Lelang
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Kelola pengembalian dana peserta yang tidak memenangkan
                        lelang
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/40">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {counts.pending}
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                    Menunggu
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                                <ShieldCheck className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">
                                    {counts.eligible}
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                    Eligible
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">
                                    {counts.completed}
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    Selesai
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/40">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">
                                    {counts.rejected}
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-400">
                                    Ditolak
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 pb-4 dark:border-gray-700">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={`/admin/reimbursements?status=${tab.key}`}
                            className={`rounded-lg px-4 py-2 font-medium whitespace-nowrap transition-colors ${
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
                {reimbursements.data.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                        <RefreshCcw className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                            Tidak ada data
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada reimbursement dengan status ini
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                            Lelang
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                            Eligible
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
                                    {reimbursements.data.map((item) => {
                                        const status =
                                            statusConfig[item.status] ||
                                            statusConfig.pending;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                            >
                                                {/* User */}
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

                                                {/* Auction */}
                                                <td className="max-w-[200px] px-6 py-4">
                                                    <p
                                                        className="truncate font-medium text-gray-900 dark:text-white"
                                                        title={
                                                            item.auction?.title
                                                        }
                                                    >
                                                        {item.auction?.title ||
                                                            '-'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Ref:{' '}
                                                        {item.reference_number}
                                                    </p>
                                                </td>

                                                {/* Amount */}
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {item.formatted_amount}
                                                    </p>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                                                    >
                                                        <status.icon className="h-3.5 w-3.5" />
                                                        {status.label}
                                                    </span>
                                                    {item.admin_notes && (
                                                        <p className="mt-1 text-xs text-red-500">
                                                            {item.admin_notes}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Eligible countdown */}
                                                <td className="px-6 py-4">
                                                    {item.status ===
                                                        'pending' &&
                                                    item.remaining_days > 0 ? (
                                                        <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
                                                            <Timer className="h-4 w-4" />
                                                            <span>
                                                                {
                                                                    item.remaining_days
                                                                }{' '}
                                                                hari lagi
                                                            </span>
                                                        </div>
                                                    ) : item.status ===
                                                      'pending' ? (
                                                        <span className="text-sm text-blue-600 dark:text-blue-400">
                                                            Segera eligible
                                                        </span>
                                                    ) : item.eligible_at ? (
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(
                                                                item.eligible_at,
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">
                                                            -
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {formatDate(
                                                        item.created_at,
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    {canApprove(item) ||
                                                    canReject(item) ? (
                                                        rejectingId ===
                                                        item.id ? (
                                                            <div className="flex items-center justify-end gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        rejectForm
                                                                            .data
                                                                            .reason
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        rejectForm.setData(
                                                                            'reason',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Alasan penolakan"
                                                                    className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                                                                            .reason ||
                                                                        rejectForm.processing
                                                                    }
                                                                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setRejectingId(
                                                                            null,
                                                                        );
                                                                        rejectForm.reset();
                                                                    }}
                                                                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-end gap-2">
                                                                {canApprove(
                                                                    item,
                                                                ) && (
                                                                    <button
                                                                        onClick={() =>
                                                                            setConfirmApproveId(
                                                                                item.id,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            approvingId ===
                                                                            item.id
                                                                        }
                                                                        className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                        Approve
                                                                    </button>
                                                                )}
                                                                {canReject(
                                                                    item,
                                                                ) && (
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
                                                                )}
                                                            </div>
                                                        )
                                                    ) : item.processed_by_user ? (
                                                        <p className="text-right text-xs text-gray-400">
                                                            oleh{' '}
                                                            {
                                                                item
                                                                    .processed_by_user
                                                                    .name
                                                            }
                                                        </p>
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
                        </div>

                        {/* Pagination */}
                        {reimbursements.last_page > 1 && (
                            <div className="flex justify-center gap-2 border-t border-gray-100 p-4 dark:border-gray-700">
                                {Array.from(
                                    { length: reimbursements.last_page },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/admin/reimbursements?status=${currentStatus}&page=${page}`}
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                                            page === reimbursements.current_page
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
