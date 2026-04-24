import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { ArrowLeft, Wallet, CreditCard, QrCode, Building2, Check } from 'lucide-react';

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

const paymentTypeConfig: Record<string, { label: string; icon: typeof CreditCard }> = {
    bank_transfer: { label: 'Transfer Bank', icon: Building2 },
    e_wallet: { label: 'E-Wallet', icon: Wallet },
    qris: { label: 'QRIS', icon: QrCode },
};

export default function TopupCreate({ balance, formattedBalance, presetAmounts, minAmount, maxAmount, paymentMethods }: Props) {
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

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const isValidAmount = selectedAmount >= minAmount && selectedAmount <= maxAmount;

    return (
        <AppLayout>
            <Head title="Top Up Saldo" />

            <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
                <div className="max-w-xl mx-auto px-4 py-8">
                    
                    {/* Header with Back Button */}
                    <div className="flex items-center gap-4 mb-8">
                        {step === 1 ? (
                            <Link
                                href="/dashboard"
                                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </Link>
                        ) : (
                            <button
                                onClick={goBack}
                                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Top Up Saldo
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {step === 1 ? 'Pilih nominal' : 'Pilih metode pembayaran'}
                            </p>
                        </div>
                    </div>

                    {/* Wizard Steps */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            step === 1 
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                                : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                            {step === 2 ? <Check className="w-4 h-4" /> : <span className="w-4 text-center">1</span>}
                            <span>Nominal</span>
                        </div>
                        <div className="w-8 h-px bg-gray-300 dark:bg-gray-700" />
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            step === 2 
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                                : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                        }`}>
                            <span className="w-4 text-center">2</span>
                            <span>Metode</span>
                        </div>
                    </div>

                    {/* Current Balance - Compact */}
                    <div className="flex items-center justify-between p-4 mb-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Saldo saat ini</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{formattedBalance}</span>
                    </div>

                    {step === 1 ? (
                        /* Step 1: Amount Selection */
                        <div className="space-y-6">
                            {/* Preset Amounts */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Pilih Nominal
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {presetAmounts.filter(a => a <= maxAmount).map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => handleAmountSelect(amount)}
                                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                                                selectedAmount === amount && !customAmount
                                                    ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                                                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
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
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Atau masukkan nominal lain
                                </h3>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                        placeholder="0"
                                        className="w-full pl-12 pr-4 py-4 text-xl font-medium rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Min Rp {new Intl.NumberFormat('id-ID').format(minAmount)} • Max Rp {new Intl.NumberFormat('id-ID').format(maxAmount)}
                                </p>
                            </div>

                            {/* Selected Amount Preview */}
                            {selectedAmount > 0 && (
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nominal Top Up</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        Rp {new Intl.NumberFormat('id-ID').format(selectedAmount)}
                                    </p>
                                </div>
                            )}

                            {/* Continue Button */}
                            <button
                                onClick={proceedToMethod}
                                disabled={!isValidAmount}
                                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Lanjutkan
                            </button>

                            {errors.amount && (
                                <p className="text-red-500 text-center text-sm">{errors.amount}</p>
                            )}
                        </div>
                    ) : (
                        /* Step 2: Payment Method Selection */
                        <div className="space-y-6">
                            {/* Selected Amount Summary */}
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Nominal Top Up</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        Rp {new Intl.NumberFormat('id-ID').format(data.amount)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            {Object.entries(paymentMethods).map(([type, methods]) => {
                                const config = paymentTypeConfig[type];
                                const TypeIcon = config?.icon || Wallet;

                                return (
                                    <div key={type}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <TypeIcon className="w-4 h-4 text-gray-500" />
                                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {config?.label || type}
                                            </h3>
                                        </div>
                                        <div className="space-y-2">
                                            {methods.map((method) => (
                                                <button
                                                    key={method.code}
                                                    onClick={() => handleMethodSelect(method.code)}
                                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                                        data.payment_method === method.code
                                                            ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                                                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                                {method.icon.toUpperCase().slice(0, 3)}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {method.name}
                                                        </span>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                        data.payment_method === method.code
                                                            ? 'border-gray-900 bg-gray-900 dark:border-white dark:bg-white'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    }`}>
                                                        {data.payment_method === method.code && (
                                                            <Check className="w-3 h-3 text-white dark:text-gray-900" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Pay Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!data.payment_method || processing}
                                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Memproses...' : 'Bayar Sekarang'}
                            </button>

                            {errors.payment_method && (
                                <p className="text-red-500 text-center text-sm">{errors.payment_method}</p>
                            )}
                        </div>
                    )}

                    {/* Link to History */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/topups"
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Lihat Riwayat Top Up
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
