import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { ArrowDownRight, Clock, CheckCircle, XCircle, Loader2, Eye, Check, X, Filter } from 'lucide-react';

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
    status: 'pending' | 'approved' | 'processing' | 'completed' | 'failed' | 'rejected';
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
    pending: { label: 'Menunggu', icon: Clock, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    approved: { label: 'Disetujui', icon: CheckCircle, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    processing: { label: 'Diproses', icon: Loader2, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
    completed: { label: 'Selesai', icon: CheckCircle, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    failed: { label: 'Gagal', icon: XCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    rejected: { label: 'Ditolak', icon: XCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function AdminDisbursementsIndex({ disbursements, counts, currentStatus }: Props) {
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
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Review dan approve permintaan penarikan dana
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                        <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">Menunggu</p>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <p className="text-2xl font-bold text-indigo-600">{counts.processing}</p>
                        <p className="text-sm text-indigo-700 dark:text-indigo-400">Diproses</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-2xl font-bold text-green-600">{counts.completed}</p>
                        <p className="text-sm text-green-700 dark:text-green-400">Selesai</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <p className="text-2xl font-bold text-red-600">{counts.rejected + counts.failed}</p>
                        <p className="text-sm text-red-700 dark:text-red-400">Ditolak/Gagal</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={`/admin/disbursements?status=${tab.key}`}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentStatus === tab.key
                                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {tab.label}
                            <span className="ml-2 text-xs">({counts[tab.key] || 0})</span>
                        </Link>
                    ))}
                </div>

                {/* Table */}
                {disbursements.data.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <ArrowDownRight className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Tidak ada data
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada disbursement dengan status ini
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Bank
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {disbursements.data.map((item) => {
                                    const status = statusConfig[item.status];

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {item.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{item.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {item.formatted_amount}
                                                </p>
                                                <p className="text-xs text-green-600">
                                                    Diterima: {item.formatted_total}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-900 dark:text-white">
                                                    {item.bank_account.bank_name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.bank_account.account_number}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                    <status.icon className="w-3.5 h-3.5" />
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
                                                                value={rejectForm.data.reason}
                                                                onChange={(e) => rejectForm.setData('reason', e.target.value)}
                                                                placeholder="Alasan penolakan"
                                                                className="w-40 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                            />
                                                            <button
                                                                onClick={() => handleReject(item.id)}
                                                                disabled={!rejectForm.data.reason}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setRejectingId(null)}
                                                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleApprove(item.id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => setRejectingId(item.id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {disbursements.last_page > 1 && (
                            <div className="flex justify-center gap-2 p-4 border-t border-gray-100 dark:border-gray-700">
                                {Array.from({ length: disbursements.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/admin/disbursements?status=${currentStatus}&page=${page}`}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                                            page === disbursements.current_page
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
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
