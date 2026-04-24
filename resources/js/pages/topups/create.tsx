import { Head, Link, useForm } from '@inertiajs/react';
import type { CreditCard } from 'lucide-react';
import { ArrowLeft, Wallet, QrCode, Building2, Check } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface PaymentMethod {
    code: string;
    name: string;
    type: string;
    icon: string;
}

interface Props {
    balance: number;
    formattedBalance: string;
    presetAmounts: number[];
    minAmount: number;
    maxAmount: number;
    paymentMethods: {
        bank_transfer: PaymentMethod[];
        e_wallet: PaymentMethod[];
        qris: PaymentMethod[];
    };
}

const paymentTypeConfig: Record<
    string,
    { label: string; icon: typeof CreditCard }
> = {
    bank_transfer: { label: 'Transfer Bank', icon: Building2 },
    e_wallet: { label: 'E-Wallet', icon: Wallet },
    qris: { label: 'QRIS', icon: QrCode },
};

export default function TopupCreate({
    formattedBalance,
    presetAmounts,
    minAmount,
    maxAmount,
    paymentMethods,
}: Props) {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedAmount, setSelectedAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        amount: 0,
        payment_method: '',
    });

    const formatAmount = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (!numericValue) return '';
        return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
    };

    const handleCustomAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const formatted = formatAmount(e.target.value);
        setCustomAmount(formatted);
        setSelectedAmount(parseInt(e.target.value.replace(/\D/g, '')) || 0);
    };

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const proceedToMethod = () => {
        if (selectedAmount >= minAmount && selectedAmount <= maxAmount) {
            setData('amount', selectedAmount);
            setStep(2);
        }
    };

    const goBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleMethodSelect = (method: string) => {
        setData('payment_method', method);
    };

    const handleSubmit = () => {
        if (data.amount && data.payment_method) {
            post('/topups');
        }
    };

    const isValidAmount =
        selectedAmount >= minAmount && selectedAmount <= maxAmount;

    return (
        <AppLayout>
            <Head title="Top Up Saldo" />

            <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
                <div className="mx-auto max-w-xl px-4 py-8">
                    {/* Header with Back Button */}
                    <div className="mb-8 flex items-center gap-4">
                        {step === 1 ? (
                            <Link
                                href="/dashboard"
                                className="-ml-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </Link>
                        ) : (
                            <button
                                onClick={goBack}
                                className="-ml-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Top Up Saldo
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {step === 1
                                    ? 'Pilih nominal'
                                    : 'Pilih metode pembayaran'}
                            </p>
                        </div>
                    </div>

                    {/* Wizard Steps */}
                    <div className="mb-8 flex items-center gap-3">
                        <div
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                step === 1
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                    : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                        >
                            {step === 2 ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <span className="w-4 text-center">1</span>
                            )}
                            <span>Nominal</span>
                        </div>
                        <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />
                        <div
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                step === 2
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                            }`}
                        >
                            <span className="w-4 text-center">2</span>
                            <span>Metode</span>
                        </div>
                    </div>

                    {/* Current Balance - Compact */}
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                                <Wallet className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Saldo saat ini
                            </span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {formattedBalance}
                        </span>
                    </div>

                    {step === 1 ? (
                        /* Step 1: Amount Selection */
                        <div className="space-y-6">
                            {/* Preset Amounts */}
                            <div>
                                <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pilih Nominal
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {presetAmounts
                                        .filter((a) => a <= maxAmount)
                                        .map((amount) => (
                                            <button
                                                key={amount}
                                                onClick={() =>
                                                    handleAmountSelect(amount)
                                                }
                                                className={`rounded-xl border-2 p-4 text-center transition-all ${
                                                    selectedAmount === amount &&
                                                    !customAmount
                                                        ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800'
                                                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
                                                }`}
                                            >
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {amount >= 1000000
                                                        ? `${amount / 1000000} Juta`
                                                        : `${amount / 1000} Ribu`}
                                                </p>
                                            </button>
                                        ))}
                                </div>
                            </div>

                            {/* Custom Amount */}
                            <div>
                                <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Atau masukkan nominal lain
                                </h3>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-gray-400">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                        placeholder="0"
                                        className="w-full rounded-xl border-2 border-gray-200 bg-white py-4 pr-4 pl-12 text-xl font-medium text-gray-900 transition-colors focus:border-gray-900 focus:ring-0 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Min Rp{' '}
                                    {new Intl.NumberFormat('id-ID').format(
                                        minAmount,
                                    )}{' '}
                                    • Max Rp{' '}
                                    {new Intl.NumberFormat('id-ID').format(
                                        maxAmount,
                                    )}
                                </p>
                            </div>

                            {/* Selected Amount Preview */}
                            {selectedAmount > 0 && (
                                <div className="rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800">
                                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                        Nominal Top Up
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        Rp{' '}
                                        {new Intl.NumberFormat('id-ID').format(
                                            selectedAmount,
                                        )}
                                    </p>
                                </div>
                            )}

                            {/* Continue Button */}
                            <button
                                onClick={proceedToMethod}
                                disabled={!isValidAmount}
                                className="w-full rounded-xl bg-gray-900 py-4 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                Lanjutkan
                            </button>

                            {errors.amount && (
                                <p className="text-center text-sm text-red-500">
                                    {errors.amount}
                                </p>
                            )}
                        </div>
                    ) : (
                        /* Step 2: Payment Method Selection */
                        <div className="space-y-6">
                            {/* Selected Amount Summary */}
                            <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Nominal Top Up
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        Rp{' '}
                                        {new Intl.NumberFormat('id-ID').format(
                                            data.amount,
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            {Object.entries(paymentMethods).map(
                                ([type, methods]) => {
                                    const config = paymentTypeConfig[type];
                                    const TypeIcon = config?.icon || Wallet;

                                    return (
                                        <div key={type}>
                                            <div className="mb-3 flex items-center gap-2">
                                                <TypeIcon className="h-4 w-4 text-gray-500" />
                                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {config?.label || type}
                                                </h3>
                                            </div>
                                            <div className="space-y-2">
                                                {methods.map((method) => (
                                                    <button
                                                        key={method.code}
                                                        onClick={() =>
                                                            handleMethodSelect(
                                                                method.code,
                                                            )
                                                        }
                                                        className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all ${
                                                            data.payment_method ===
                                                            method.code
                                                                ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800'
                                                                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                                    {method.icon
                                                                        .toUpperCase()
                                                                        .slice(
                                                                            0,
                                                                            3,
                                                                        )}
                                                                </span>
                                                            </div>
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {method.name}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                                                                data.payment_method ===
                                                                method.code
                                                                    ? 'border-gray-900 bg-gray-900 dark:border-white dark:bg-white'
                                                                    : 'border-gray-300 dark:border-gray-600'
                                                            }`}
                                                        >
                                                            {data.payment_method ===
                                                                method.code && (
                                                                <Check className="h-3 w-3 text-white dark:text-gray-900" />
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                },
                            )}

                            {/* Pay Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!data.payment_method || processing}
                                className="w-full rounded-xl bg-gray-900 py-4 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                {processing ? 'Memproses...' : 'Bayar Sekarang'}
                            </button>

                            {errors.payment_method && (
                                <p className="text-center text-sm text-red-500">
                                    {errors.payment_method}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Link to History */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/topups"
                            className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            Lihat Riwayat Top Up
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
