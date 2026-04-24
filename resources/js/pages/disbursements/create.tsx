import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, Building2, AlertCircle, ArrowDownRight, Calculator, Info } from 'lucide-react';

interface BankAccount {
    id: number;
    bank_code: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    is_primary: boolean;
}

interface Props {
    accounts: BankAccount[];
    balance: number;
    formattedBalance: string;
    minAmount: number;
    feePercentage: number;
}

export default function DisbursementCreate({ accounts, balance, formattedBalance, minAmount, feePercentage }: Props) {
    const [feePreview, setFeePreview] = useState({
        fee: 0,
        total: 0,
        formatted_fee: 'Rp 0',
        formatted_total: 'Rp 0',
    });

    const { data, setData, post, processing, errors, transform } = useForm({
        bank_account_id: accounts.find(a => a.is_primary)?.id.toString() || '',
        amount: '',
        notes: '',
    });

    // Calculate fee preview
    useEffect(() => {
        const amount = parseFloat(data.amount.replace(/\D/g, '')) || 0;
        if (amount > 0) {
            const fee = amount * (feePercentage / 100);
            const total = amount - fee;
            setFeePreview({
                fee,
                total,
                formatted_fee: 'Rp ' + new Intl.NumberFormat('id-ID').format(fee),
                formatted_total: 'Rp ' + new Intl.NumberFormat('id-ID').format(total),
            });
        } else {
            setFeePreview({
                fee: 0,
                total: 0,
                formatted_fee: 'Rp 0',
                formatted_total: 'Rp 0',
            });
        }
    }, [data.amount, feePercentage]);

    const formatAmount = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (!numericValue) return '';
        return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('amount', formatAmount(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = data.amount.replace(/\D/g, '');
        transform((data) => ({
            ...data,
            amount: numericAmount,
        }));
        post('/disbursements');
    };

    const numericAmount = parseFloat(data.amount.replace(/\D/g, '')) || 0;
    const canSubmit = numericAmount >= minAmount && numericAmount <= balance && data.bank_account_id;

    return (
        <AppLayout>
            <Head title="Tarik Dana" />

            <div className="p-6 max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/disbursements"
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Tarik Dana
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Tarik saldo ke rekening bank Anda
                    </p>
                </div>

                {/* Balance Card */}
                <div className="mb-6 p-5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Wallet className="w-5 h-5" />
                        <span className="text-white/80">Saldo Tersedia</span>
                    </div>
                    <p className="text-3xl font-bold">{formattedBalance}</p>
                </div>

                {/* No accounts warning */}
                {accounts.length === 0 ? (
                    <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-amber-800 dark:text-amber-200">
                                    Belum ada rekening bank
                                </h3>
                                <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                                    Tambahkan rekening bank terlebih dahulu untuk melakukan penarikan.
                                </p>
                                <Link
                                    href="/bank-accounts"
                                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    <Building2 className="w-4 h-4" />
                                    Tambah Rekening
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Bank Account Selection */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Rekening Tujuan
                            </label>
                            <div className="space-y-3">
                                {accounts.map((account) => (
                                    <label
                                        key={account.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            data.bank_account_id === account.id.toString()
                                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="bank_account_id"
                                            value={account.id}
                                            checked={data.bank_account_id === account.id.toString()}
                                            onChange={(e) => setData('bank_account_id', e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            data.bank_account_id === account.id.toString()
                                                ? 'border-violet-500 bg-violet-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                            {data.bank_account_id === account.id.toString() && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {account.bank_name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {account.account_number} • {account.account_name}
                                            </p>
                                        </div>
                                        {account.is_primary && (
                                            <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-medium rounded-full">
                                                Utama
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                            {errors.bank_account_id && (
                                <p className="text-red-500 text-sm mt-2">{errors.bank_account_id}</p>
                            )}
                        </div>

                        {/* Amount Input */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Jumlah Penarikan
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    Rp
                                </span>
                                <input
                                    type="text"
                                    value={data.amount}
                                    onChange={handleAmountChange}
                                    placeholder="0"
                                    className="w-full pl-12 pr-4 py-4 text-2xl font-semibold rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Minimum: Rp {new Intl.NumberFormat('id-ID').format(minAmount)}
                            </p>
                            {errors.amount && (
                                <p className="text-red-500 text-sm mt-2">{errors.amount}</p>
                            )}

                            {/* Quick Amount Buttons */}
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {[100000, 250000, 500000, 1000000].map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => setData('amount', formatAmount(amount.toString()))}
                                        disabled={amount > balance}
                                        className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                    >
                                        {amount >= 1000000 ? `${amount / 1000000}JT` : `${amount / 1000}RB`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fee Preview */}
                        {numericAmount > 0 && (
                            <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calculator className="w-5 h-5 text-gray-500" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">Rincian</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Jumlah Penarikan</span>
                                        <span className="text-gray-900 dark:text-white">Rp {data.amount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Biaya Admin ({feePercentage}%)</span>
                                        <span className="text-red-500">-{feePreview.formatted_fee}</span>
                                    </div>
                                    <hr className="border-gray-200 dark:border-gray-700" />
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-gray-900 dark:text-white">Yang Diterima</span>
                                        <span className="text-green-600 dark:text-green-400">{feePreview.formatted_total}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Catatan (Opsional)
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Tambahkan catatan..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Penarikan akan diproses setelah disetujui admin. Estimasi waktu 1-24 jam kerja.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!canSubmit || processing}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowDownRight className="w-5 h-5" />
                            {processing ? 'Memproses...' : 'Ajukan Penarikan'}
                        </button>

                        {(errors as Record<string, string>).error && (
                            <p className="text-red-500 text-center">{(errors as Record<string, string>).error}</p>
                        )}
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
