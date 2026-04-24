import { Zap, Wallet, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface QuickBid {
    label: string;
    amount: number;
}

interface BidControlsProps {
    currentPrice: number;
    nextMinBid: number;
    bidIncrement: number;
    quickBids: QuickBid[];
    onPlaceBid: (amount: number) => Promise<void>;
    disabled?: boolean;
    isLoading?: boolean;
    userBalance?: number | null;
    userDeposit?: number;
}

function formatCurrency(amount: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

export default function BidControls({
    currentPrice,
    nextMinBid,
    bidIncrement,
    quickBids,
    onPlaceBid,
    disabled = false,
    isLoading = false,
    userBalance = null,
    userDeposit = 0,
}: BidControlsProps) {
    const [customAmount, setCustomAmount] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [pendingBidAmount, setPendingBidAmount] = useState<number | null>(
        null,
    );
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const requestBid = (amount: number) => {
        setError('');

        // Calculate actual charge (bid amount minus existing deposit)
        const chargeAmount = amount - userDeposit;

        // Check balance before showing confirmation (only check incremental charge)
        if (userBalance !== null && userBalance < chargeAmount) {
            setError(
                `Saldo tidak mencukupi. Saldo Anda: ${formatCurrency(userBalance)}, Perlu tambahan: ${formatCurrency(chargeAmount)}`,
            );
            return;
        }

        // Show confirmation dialog
        setPendingBidAmount(amount);
        setIsConfirmOpen(true);
    };

    const confirmBid = async () => {
        if (pendingBidAmount === null) return;

        setIsConfirmOpen(false);
        const amount = pendingBidAmount;
        setPendingBidAmount(null);

        try {
            await onPlaceBid(amount);
        } catch (e: unknown) {
            setError(
                (e instanceof Error ? e.message : null) ||
                    'Gagal menempatkan bid',
            );
        }
    };

    const cancelBid = () => {
        setIsConfirmOpen(false);
        setPendingBidAmount(null);
    };

    const handleQuickBid = (amount: number) => {
        requestBid(amount);
    };

    const handleCustomBid = () => {
        setError('');
        const amount = parseInt(customAmount.replace(/\D/g, ''), 10);

        if (isNaN(amount) || amount < nextMinBid) {
            setError(`Bid minimum adalah ${formatCurrency(nextMinBid)}`);
            return;
        }

        const difference = amount - currentPrice;
        if (difference % bidIncrement !== 0) {
            setError(`Bid harus kelipatan ${formatCurrency(bidIncrement)}`);
            return;
        }

        requestBid(amount);
    };

    const formatInputValue = (value: string): string => {
        const numericValue = value.replace(/\D/g, '');
        if (!numericValue) return '';
        return new Intl.NumberFormat('id-ID').format(
            parseInt(numericValue, 10),
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatInputValue(e.target.value);
        setCustomAmount(formatted);
        setError('');
    };

    return (
        <div className="space-y-4">
            {/* Balance Display */}
            {userBalance !== null && (
                <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                    <Wallet className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                        Saldo Anda:{' '}
                        <span className="font-bold">
                            {formatCurrency(userBalance)}
                        </span>
                    </span>
                </div>
            )}

            {/* Current Price Display */}
            <div className="rounded-xl bg-slate-100 p-4 text-center dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Harga Saat Ini
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(currentPrice)}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Minimum bid: {formatCurrency(nextMinBid)}
                </p>
            </div>

            {/* Quick Bid Buttons */}
            <div className="grid grid-cols-2 gap-2">
                {quickBids.map((bid, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuickBid(bid.amount)}
                        disabled={disabled || isLoading}
                        className="group relative rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Zap className="h-4 w-4" />
                            {bid.label}
                        </span>
                        <span className="block text-xs opacity-75">
                            {formatCurrency(bid.amount)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Custom Bid Input */}
            <div className="space-y-2">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                            Rp
                        </span>
                        <input
                            type="text"
                            value={customAmount}
                            onChange={handleInputChange}
                            placeholder="Masukkan jumlah"
                            disabled={disabled || isLoading}
                            className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-10 text-slate-900 focus:border-transparent focus:ring-2 focus:ring-amber-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={handleCustomBid}
                        disabled={disabled || isLoading || !customAmount}
                        className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        {isLoading ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            'Bid'
                        )}
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}
            </div>

            {/* Bid Increment Info */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Kelipatan bid: {formatCurrency(bidIncrement)}
            </p>

            {/* Confirmation Dialog Overlay */}
            {isConfirmOpen && pendingBidAmount !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={cancelBid}
                    />

                    {/* Dialog */}
                    <div className="relative w-full max-w-sm animate-in space-y-5 rounded-2xl bg-white p-6 shadow-2xl zoom-in-95 fade-in dark:bg-slate-800">
                        {/* Close button */}
                        <button
                            onClick={cancelBid}
                            className="absolute top-4 right-4 rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <X className="h-5 w-5 text-slate-400" />
                        </button>

                        {/* Header */}
                        <div className="text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                                <Zap className="h-6 w-6 text-amber-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Konfirmasi Bid
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Saldo Anda akan dipotong untuk bid ini
                            </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Jumlah Bid
                                </span>
                                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                    {formatCurrency(pendingBidAmount)}
                                </span>
                            </div>
                            {userDeposit > 0 && (
                                <>
                                    <div className="border-t border-slate-200 dark:border-slate-600" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Deposit Ditahan
                                        </span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                            - {formatCurrency(userDeposit)}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className="border-t border-slate-200 dark:border-slate-600" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {userDeposit > 0
                                        ? 'Tambahan Potongan'
                                        : 'Potongan Saldo'}
                                </span>
                                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                    {formatCurrency(
                                        pendingBidAmount - userDeposit,
                                    )}
                                </span>
                            </div>
                            <div className="border-t border-slate-200 dark:border-slate-600" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Saldo Saat Ini
                                </span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {userBalance !== null
                                        ? formatCurrency(userBalance)
                                        : '-'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Saldo Setelah Bid
                                </span>
                                <span
                                    className={`font-semibold ${
                                        userBalance !== null &&
                                        userBalance -
                                            (pendingBidAmount - userDeposit) >=
                                            0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}
                                >
                                    {userBalance !== null
                                        ? formatCurrency(
                                              Math.max(
                                                  0,
                                                  userBalance -
                                                      (pendingBidAmount -
                                                          userDeposit),
                                              ),
                                          )
                                        : '-'}
                                </span>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                Deposit saldo ditahan selama lelang berlangsung.
                                Jika Anda tidak menang, deposit akan
                                dikembalikan setelah lelang berakhir.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={cancelBid}
                                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmBid}
                                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-amber-500/25"
                            >
                                Konfirmasi Bid
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
