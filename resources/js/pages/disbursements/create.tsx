import { Head, useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Wallet,
    Building2,
    AlertCircle,
    ArrowDownRight,
    Calculator,
    Info,
} from 'lucide-react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';

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

export default function DisbursementCreate({
    accounts,
    balance,
    formattedBalance,
    minAmount,
    feePercentage,
}: Props) {
    const { data, setData, post, processing, errors, transform } = useForm({
        bank_account_id:
            accounts.find((a) => a.is_primary)?.id.toString() || '',
        amount: '',
        notes: '',
    });

    // Calculate fee preview
    const feePreview = useMemo(() => {
        const amount = parseFloat(data.amount.replace(/\D/g, '')) || 0;
        if (amount > 0) {
            const fee = amount * (feePercentage / 100);
            const total = amount - fee;
            return {
                fee,
                total,
                formatted_fee:
                    'Rp ' + new Intl.NumberFormat('id-ID').format(fee),
                formatted_total:
                    'Rp ' + new Intl.NumberFormat('id-ID').format(total),
            };
        }
        return {
            fee: 0,
            total: 0,
            formatted_fee: 'Rp 0',
            formatted_total: 'Rp 0',
        };
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
    const canSubmit =
        numericAmount >= minAmount &&
        numericAmount <= balance &&
        data.bank_account_id;

    return (
        <AppLayout>
            <Head title="Tarik Dana" />

            <div className="mx-auto max-w-2xl p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/disbursements"
                        className="mb-4 flex items-center gap-2 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Tarik Dana
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Tarik saldo ke rekening bank Anda
                    </p>
                </div>

                {/* Balance Card */}
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-5 text-white">
                    <div className="mb-2 flex items-center gap-3">
                        <Wallet className="h-5 w-5" />
                        <span className="text-white/80">Saldo Tersedia</span>
                    </div>
                    <p className="text-3xl font-bold">{formattedBalance}</p>
                </div>

                {/* No accounts warning */}
                {accounts.length === 0 ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                            <div>
                                <h3 className="font-medium text-amber-800 dark:text-amber-200">
                                    Belum ada rekening bank
                                </h3>
                                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                                    Tambahkan rekening bank terlebih dahulu
                                    untuk melakukan penarikan.
                                </p>
                                <Link
                                    href="/bank-accounts"
                                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-700"
                                >
                                    <Building2 className="h-4 w-4" />
                                    Tambah Rekening
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Bank Account Selection */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Rekening Tujuan
                            </label>
                            <div className="space-y-3">
                                {accounts.map((account) => (
                                    <label
                                        key={account.id}
                                        className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                                            data.bank_account_id ===
                                            account.id.toString()
                                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="bank_account_id"
                                            value={account.id}
                                            checked={
                                                data.bank_account_id ===
                                                account.id.toString()
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'bank_account_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="sr-only"
                                        />
                                        <div
                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                data.bank_account_id ===
                                                account.id.toString()
                                                    ? 'border-violet-500 bg-violet-500'
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        >
                                            {data.bank_account_id ===
                                                account.id.toString() && (
                                                <div className="h-2 w-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {account.bank_name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {account.account_number} •{' '}
                                                {account.account_name}
                                            </p>
                                        </div>
                                        {account.is_primary && (
                                            <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                                                Utama
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                            {errors.bank_account_id && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.bank_account_id}
                                </p>
                            )}
                        </div>

                        {/* Amount Input */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Jumlah Penarikan
                            </label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">
                                    Rp
                                </span>
                                <input
                                    type="text"
                                    value={data.amount}
                                    onChange={handleAmountChange}
                                    placeholder="0"
                                    className="w-full rounded-xl border border-gray-300 bg-white py-4 pr-4 pl-12 text-2xl font-semibold text-gray-900 focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Minimum: Rp{' '}
                                {new Intl.NumberFormat('id-ID').format(
                                    minAmount,
                                )}
                            </p>
                            {errors.amount && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.amount}
                                </p>
                            )}

                            {/* Quick Amount Buttons */}
                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {[100000, 250000, 500000, 1000000].map(
                                    (amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    'amount',
                                                    formatAmount(
                                                        amount.toString(),
                                                    ),
                                                )
                                            }
                                            disabled={amount > balance}
                                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-700"
                                        >
                                            {amount >= 1000000
                                                ? `${amount / 1000000}JT`
                                                : `${amount / 1000}RB`}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Fee Preview */}
                        {numericAmount > 0 && (
                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
                                <div className="mb-4 flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-gray-500" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        Rincian
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Jumlah Penarikan
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                            Rp {data.amount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Biaya Admin ({feePercentage}%)
                                        </span>
                                        <span className="text-red-500">
                                            -{feePreview.formatted_fee}
                                        </span>
                                    </div>
                                    <hr className="border-gray-200 dark:border-gray-700" />
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-gray-900 dark:text-white">
                                            Yang Diterima
                                        </span>
                                        <span className="text-green-600 dark:text-green-400">
                                            {feePreview.formatted_total}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Catatan (Opsional)
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                placeholder="Tambahkan catatan..."
                                rows={3}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                            <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Penarikan akan diproses setelah disetujui admin.
                                Estimasi waktu 1-24 jam kerja.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!canSubmit || processing}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-4 font-semibold text-white transition-all hover:from-violet-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ArrowDownRight className="h-5 w-5" />
                            {processing ? 'Memproses...' : 'Ajukan Penarikan'}
                        </button>

                        {(errors as Record<string, string>).error && (
                            <p className="text-center text-red-500">
                                {(errors as Record<string, string>).error}
                            </p>
                        )}
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
