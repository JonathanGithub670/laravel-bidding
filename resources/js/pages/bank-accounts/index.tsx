import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Plus, Trash2, Star, Building2, CreditCard, Edit2, Check, X } from 'lucide-react';

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

            <div className="p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Rekening Bank
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Kelola rekening untuk pencairan dana
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Rekening
                    </button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Tambah Rekening Baru
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Bank
                                    </label>
                                    <select
                                        value={data.bank_code}
                                        onChange={(e) => setData('bank_code', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                                    >
                                        <option value="">Pilih Bank</option>
                                        {Object.entries(banks).map(([code, name]) => (
                                            <option key={code} value={code}>
                                                {code} - {name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.bank_code && (
                                        <p className="text-red-500 text-sm mt-1">{errors.bank_code}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nomor Rekening
                                    </label>
                                    <input
                                        type="text"
                                        value={data.account_number}
                                        onChange={(e) => setData('account_number', e.target.value)}
                                        placeholder="1234567890"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                                    />
                                    {errors.account_number && (
                                        <p className="text-red-500 text-sm mt-1">{errors.account_number}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nama Pemilik
                                    </label>
                                    <input
                                        type="text"
                                        value={data.account_name}
                                        onChange={(e) => setData('account_name', e.target.value)}
                                        placeholder="Nama sesuai rekening"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                                    />
                                    {errors.account_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.account_name}</p>
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
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Account List */}
                {accounts.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <Building2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
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
                                className={`p-5 bg-white dark:bg-gray-800 rounded-2xl border transition-all ${
                                    account.is_primary
                                        ? 'border-violet-300 dark:border-violet-600 ring-2 ring-violet-100 dark:ring-violet-900/30'
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                {editingId === account.id ? (
                                    /* Edit Mode */
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <select
                                                value={editForm.data.bank_code}
                                                onChange={(e) => editForm.setData('bank_code', e.target.value)}
                                                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                {Object.entries(banks).map(([code, name]) => (
                                                    <option key={code} value={code}>
                                                        {code} - {name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={editForm.data.account_number}
                                                onChange={(e) => editForm.setData('account_number', e.target.value)}
                                                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.data.account_name}
                                                onChange={(e) => editForm.setData('account_name', e.target.value)}
                                                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(account.id)}
                                                disabled={editForm.processing}
                                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {account.bank_name}
                                                    </h3>
                                                    {account.is_primary && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-medium rounded-full">
                                                            <Star className="w-3 h-3" />
                                                            Utama
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {account.account_number} • {account.account_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!account.is_primary && (
                                                <button
                                                    onClick={() => handleSetPrimary(account.id)}
                                                    className="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                                                    title="Jadikan Utama"
                                                >
                                                    <Star className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEdit(account)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(account.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-5 h-5" />
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
