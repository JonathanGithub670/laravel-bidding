import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Trash2,
    Star,
    Building2,
    CreditCard,
    Edit2,
    Check,
    X,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface BankAccount {
    id: number;
    bank_code: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    is_primary: boolean;
    is_verified: boolean;
}

interface Props {
    accounts: BankAccount[];
    banks: Record<string, string>;
}

export default function BankAccountsIndex({ accounts, banks }: Props) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        bank_code: '',
        account_number: '',
        account_name: '',
    });

    const editForm = useForm({
        bank_code: '',
        account_number: '',
        account_name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bank-accounts', {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            },
        });
    };

    const handleEdit = (account: BankAccount) => {
        setEditingId(account.id);
        editForm.setData({
            bank_code: account.bank_code,
            account_number: account.account_number,
            account_name: account.account_name,
        });
    };

    const handleUpdate = (accountId: number) => {
        editForm.put(`/bank-accounts/${accountId}`, {
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = (accountId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus rekening ini?')) {
            router.delete(`/bank-accounts/${accountId}`);
        }
    };

    const handleSetPrimary = (accountId: number) => {
        router.post(`/bank-accounts/${accountId}/set-primary`);
    };

    return (
        <AppLayout>
            <Head title="Rekening Bank" />

            <div className="mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Rekening Bank
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Kelola rekening untuk pencairan dana
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-violet-700"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Rekening
                    </button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                            Tambah Rekening Baru
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Bank
                                    </label>
                                    <select
                                        value={data.bank_code}
                                        onChange={(e) =>
                                            setData('bank_code', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Pilih Bank</option>
                                        {Object.entries(banks).map(
                                            ([code, name]) => (
                                                <option key={code} value={code}>
                                                    {code} - {name}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                    {errors.bank_code && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.bank_code}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nomor Rekening
                                    </label>
                                    <input
                                        type="text"
                                        value={data.account_number}
                                        onChange={(e) =>
                                            setData(
                                                'account_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="1234567890"
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.account_number && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.account_number}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nama Pemilik
                                    </label>
                                    <input
                                        type="text"
                                        value={data.account_name}
                                        onChange={(e) =>
                                            setData(
                                                'account_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama sesuai rekening"
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.account_name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.account_name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        reset();
                                    }}
                                    className="rounded-xl px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-violet-600 px-4 py-2 text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Account List */}
                {accounts.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                        <Building2 className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                            Belum ada rekening
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tambahkan rekening bank untuk melakukan penarikan
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                className={`rounded-2xl border bg-white p-5 transition-all dark:bg-gray-800 ${
                                    account.is_primary
                                        ? 'border-violet-300 ring-2 ring-violet-100 dark:border-violet-600 dark:ring-violet-900/30'
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                {editingId === account.id ? (
                                    /* Edit Mode */
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <select
                                                value={editForm.data.bank_code}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'bank_code',
                                                        e.target.value,
                                                    )
                                                }
                                                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            >
                                                {Object.entries(banks).map(
                                                    ([code, name]) => (
                                                        <option
                                                            key={code}
                                                            value={code}
                                                        >
                                                            {code} - {name}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <input
                                                type="text"
                                                value={
                                                    editForm.data.account_number
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'account_number',
                                                        e.target.value,
                                                    )
                                                }
                                                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                value={
                                                    editForm.data.account_name
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'account_name',
                                                        e.target.value,
                                                    )
                                                }
                                                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleUpdate(account.id)
                                                }
                                                disabled={editForm.processing}
                                                className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                            >
                                                <Check className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-3">
                                                <CreditCard className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {account.bank_name}
                                                    </h3>
                                                    {account.is_primary && (
                                                        <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                                                            <Star className="h-3 w-3" />
                                                            Utama
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {account.account_number} •{' '}
                                                    {account.account_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!account.is_primary && (
                                                <button
                                                    onClick={() =>
                                                        handleSetPrimary(
                                                            account.id,
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/20"
                                                    title="Jadikan Utama"
                                                >
                                                    <Star className="h-5 w-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleEdit(account)
                                                }
                                                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                                                title="Edit"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(account.id)
                                                }
                                                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
