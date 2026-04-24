import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Copy,
    Check,
    Clock,
    AlertCircle,
    CheckCircle,
    Building2,
    QrCode,
    ChevronDown,
    ChevronUp,
    Loader2,
    X,
    CreditCard,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Topup {
    id: number;
    amount: string;
    payment_method: string;
    payment_type: string;
    status: string;
    reference_number: string;
    virtual_account_number: string | null;
    qr_code_url: string | null;
    payment_instructions: Record<string, { step: number; text: string }[]> &
        { step: number; text: string }[];
    expired_at: string;
    paid_at: string | null;
    created_at: string;
    formatted_amount: string;
    payment_method_name: string;
    remaining_seconds: number;
}

interface Props {
    topup: Topup;
    isPending: boolean;
}

export default function TopupShow({ topup, isPending }: Props) {
    const [copied, setCopied] = useState(false);
    const [remainingTime, setRemainingTime] = useState(topup.remaining_seconds);
    const [expandedInstruction, setExpandedInstruction] = useState<
        string | null
    >('mobile_banking');
    const [showSimulateModal, setShowSimulateModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (!isPending || remainingTime <= 0) return;

        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPending, remainingTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSimulatePayment = () => {
        setIsProcessing(true);
        router.post(
            `/topups/${topup.id}/simulate`,
            {},
            {
                onFinish: () => {
                    setIsProcessing(false);
                    setShowSimulateModal(false);
                },
            },
        );
    };

    const getStatusBadge = () => {
        switch (topup.status) {
            case 'pending':
                return {
                    label: 'Menunggu Pembayaran',
                    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                    icon: Loader2,
                    spin: true,
                };
            case 'paid':
                return {
                    label: 'Berhasil',
                    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    icon: CheckCircle,
                    spin: false,
                };
            case 'expired':
                return {
                    label: 'Kadaluarsa',
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
                    icon: AlertCircle,
                    spin: false,
                };
            case 'failed':
                return {
                    label: 'Gagal',
                    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    icon: AlertCircle,
                    spin: false,
                };
            default:
                return {
                    label: 'Unknown',
                    color: 'bg-gray-100 text-gray-700',
                    icon: AlertCircle,
                    spin: false,
                };
        }
    };

    const statusBadge = getStatusBadge();
    const StatusIcon = statusBadge.icon;

    return (
        <AppLayout>
            <Head title="Detail Top Up" />

            <div className="mx-auto max-w-2xl p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/topups"
                        className="mb-4 flex items-center gap-2 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Riwayat
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Detail Top Up
                        </h1>
                        <span
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${statusBadge.color}`}
                        >
                            <StatusIcon
                                className={`h-4 w-4 ${statusBadge.spin ? 'animate-spin' : ''}`}
                            />
                            {statusBadge.label}
                        </span>
                    </div>
                </div>

                {/* Success Message */}
                {topup.status === 'paid' && (
                    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div>
                                <h3 className="font-semibold text-green-800 dark:text-green-200">
                                    Pembayaran Berhasil!
                                </h3>
                                <p className="text-green-700 dark:text-green-300">
                                    Saldo Anda telah bertambah{' '}
                                    {topup.formatted_amount}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Expired Message */}
                {topup.status === 'expired' && (
                    <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-8 w-8 text-gray-500" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                    Top Up Kadaluarsa
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Silakan buat top up baru untuk mengisi
                                    saldo.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/topups/create"
                            className="mt-4 inline-block rounded-xl bg-violet-600 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-700"
                        >
                            Top Up Baru
                        </Link>
                    </div>
                )}

                {/* Amount Card */}
                <div className="mb-6 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 p-6 text-white">
                    <p className="text-sm text-white/80">Nominal Top Up</p>
                    <p className="mt-1 text-4xl font-bold">
                        {topup.formatted_amount}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="rounded bg-white/20 px-2 py-1 text-sm">
                            {topup.payment_method_name}
                        </span>
                    </div>
                </div>

                {/* Waiting for Payment - Spinner */}
                {isPending && remainingTime > 0 && (
                    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-col items-center text-center">
                            {/* Spinner */}
                            <div className="relative mb-6">
                                <div className="h-20 w-20 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                                <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-violet-600"></div>
                                <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-pulse text-violet-600" />
                            </div>

                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                Menunggu Pembayaran
                            </h3>

                            {/* Nominal */}
                            <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                                {topup.formatted_amount}
                            </p>

                            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                Selesaikan pembayaran sebelum waktu habis
                            </p>

                            {/* Countdown */}
                            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 dark:bg-amber-900/20">
                                <Clock className="h-5 w-5 text-amber-600" />
                                <span className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
                                    {formatTime(remainingTime)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Details */}
                {isPending && (
                    <div className="space-y-6">
                        {/* Virtual Account */}
                        {topup.virtual_account_number && (
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-4 flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-gray-500" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        Nomor Virtual Account
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                                    <span className="font-mono text-2xl font-bold tracking-wider text-gray-900 dark:text-white">
                                        {topup.virtual_account_number}
                                    </span>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                topup.virtual_account_number!,
                                            )
                                        }
                                        className="flex items-center gap-1 rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-400"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                        {copied ? 'Tersalin' : 'Salin'}
                                    </button>
                                </div>
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    Transfer sebesar{' '}
                                    <strong>{topup.formatted_amount}</strong> ke
                                    nomor virtual account di atas
                                </p>
                            </div>
                        )}

                        {/* QRIS */}
                        {topup.qr_code_url && (
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-4 flex items-center gap-3">
                                    <QrCode className="h-5 w-5 text-gray-500" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        Scan QR Code
                                    </h3>
                                </div>
                                <div className="flex justify-center rounded-xl bg-white p-4">
                                    <img
                                        src={topup.qr_code_url}
                                        alt="QR Code"
                                        className="h-64 w-64"
                                    />
                                </div>
                                <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Scan dengan aplikasi e-wallet atau mobile
                                    banking
                                </p>
                            </div>
                        )}

                        {/* Payment Instructions */}
                        {topup.payment_instructions &&
                            topup.payment_type === 'bank_transfer' && (
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/50">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            Cara Pembayaran
                                        </h3>
                                    </div>
                                    {[
                                        'mobile_banking',
                                        'atm',
                                        'internet_banking',
                                    ].map((key) => {
                                        const instructions =
                                            topup.payment_instructions[key];
                                        if (!instructions) return null;

                                        const labels: Record<string, string> = {
                                            mobile_banking: 'Mobile Banking',
                                            atm: 'ATM',
                                            internet_banking:
                                                'Internet Banking',
                                        };

                                        return (
                                            <div
                                                key={key}
                                                className="border-b border-gray-100 last:border-0 dark:border-gray-700"
                                            >
                                                <button
                                                    onClick={() =>
                                                        setExpandedInstruction(
                                                            expandedInstruction ===
                                                                key
                                                                ? null
                                                                : key,
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                                >
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {labels[key] || key}
                                                    </span>
                                                    {expandedInstruction ===
                                                    key ? (
                                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </button>
                                                {expandedInstruction ===
                                                    key && (
                                                    <div className="px-6 pb-4">
                                                        <ol className="space-y-2">
                                                            {instructions.map(
                                                                (item: {
                                                                    step: number;
                                                                    text: string;
                                                                }) => (
                                                                    <li
                                                                        key={
                                                                            item.step
                                                                        }
                                                                        className="flex gap-3 text-sm text-gray-600 dark:text-gray-400"
                                                                    >
                                                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                                                                            {
                                                                                item.step
                                                                            }
                                                                        </span>
                                                                        {
                                                                            item.text
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ol>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        {/* E-Wallet Instructions */}
                        {topup.payment_instructions &&
                            topup.payment_type === 'e_wallet' && (
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                                    <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
                                        Cara Pembayaran
                                    </h3>
                                    <ol className="space-y-3">
                                        {topup.payment_instructions.map(
                                            (item: {
                                                step: number;
                                                text: string;
                                            }) => (
                                                <li
                                                    key={item.step}
                                                    className="flex gap-3 text-sm text-gray-600 dark:text-gray-400"
                                                >
                                                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                                                        {item.step}
                                                    </span>
                                                    {item.text}
                                                </li>
                                            ),
                                        )}
                                    </ol>
                                </div>
                            )}

                        {/* Simulate Payment Button (Dev Only) */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                <strong>Mode Simulasi:</strong> Klik tombol di
                                bawah untuk mensimulasikan pembayaran berhasil.
                            </p>
                            <button
                                onClick={() => setShowSimulateModal(true)}
                                className="w-full rounded-xl bg-gray-900 py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                Simulasi Pembayaran Berhasil
                            </button>
                        </div>
                    </div>
                )}

                {/* Reference Info */}
                <div className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                            No. Referensi
                        </span>
                        <span className="font-mono text-gray-900 dark:text-white">
                            {topup.reference_number}
                        </span>
                    </div>
                </div>
            </div>

            {/* Simulate Payment Modal */}
            {showSimulateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() =>
                            !isProcessing && setShowSimulateModal(false)
                        }
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-md animate-in overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 fade-in zoom-in dark:bg-gray-800">
                        {/* Close Button */}
                        {!isProcessing && (
                            <button
                                onClick={() => setShowSimulateModal(false)}
                                className="absolute top-4 right-4 p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}

                        <div className="p-6">
                            {/* Icon */}
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
                                    <CreditCard className="h-8 w-8 text-emerald-600" />
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="mb-2 text-center text-xl font-semibold text-gray-900 dark:text-white">
                                Konfirmasi Pembayaran
                            </h3>
                            <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
                                Simulasi pembayaran sebesar:
                            </p>

                            {/* Amount */}
                            <div className="mb-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                                <p className="text-center text-3xl font-bold text-gray-900 dark:text-white">
                                    {topup.formatted_amount}
                                </p>
                                <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                                    {topup.payment_method_name}
                                </p>
                            </div>

                            {/* Info */}
                            <div className="mb-6 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                                <p className="text-center text-sm text-emerald-700 dark:text-emerald-300">
                                    Saldo Anda akan bertambah setelah konfirmasi
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSimulateModal(false)}
                                    disabled={isProcessing}
                                    className="flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSimulatePayment}
                                    disabled={isProcessing}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        'Konfirmasi'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
