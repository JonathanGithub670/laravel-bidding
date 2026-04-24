import { router } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';

/**
 * SessionExpiredModal — Global handler for 419 (CSRF token expired) errors.
 *
 * Intercepts:
 * 1. Fetch API requests that return 419
 * 2. Inertia responses that return 419
 *
 * Shows a branded modal instead of browser alert, then auto-refreshes.
 */

let showSessionExpired: (() => void) | null = null;

export function triggerSessionExpired() {
    showSessionExpired?.();
}

export default function SessionExpiredModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
        setCountdown(5);
    }, []);

    // Register the global trigger
    useEffect(() => {
        showSessionExpired = handleOpen;
        return () => {
            showSessionExpired = null;
        };
    }, [handleOpen]);

    // Intercept global fetch for 419 responses
    useEffect(() => {
        const originalFetch = window.fetch;

        window.fetch = async function (...args) {
            const response = await originalFetch.apply(this, args);

            if (response.status === 419) {
                handleOpen();
            }

            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [handleOpen]);

    // Handle Inertia global error events for 419
    useEffect(() => {
        const removeListener = router.on('invalid', (event) => {
            const response = event.detail.response;
            if (response?.status === 419) {
                event.preventDefault();
                handleOpen();
            }
        });

        return () => {
            removeListener();
        };
    }, [handleOpen]);

    // Countdown timer & auto-refresh
    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.reload();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    const handleRefreshNow = () => {
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div className="animate-fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="animate-modal-in relative w-full max-w-sm">
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 animate-pulse rounded-2xl bg-gradient-to-r from-[#5B8FAF] via-[#7BA8C4] to-[#5B8FAF] opacity-75 blur-sm" />

                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
                    {/* Top accent bar */}
                    <div className="h-1.5 bg-gradient-to-r from-[#4A7A9B] via-[#5B8FAF] to-[#7BA8C4]" />

                    <div className="p-6">
                        {/* Logo + Icon */}
                        <div className="mb-5 flex flex-col items-center">
                            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#5B8FAF]/20 to-[#7BA8C4]/20 ring-4 ring-[#5B8FAF]/10 dark:from-[#5B8FAF]/30 dark:to-[#7BA8C4]/30">
                                <svg
                                    className="h-8 w-8 text-[#5B8FAF]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <img
                                src="/Logo.png"
                                alt="nathBid"
                                className="h-8 object-contain opacity-80"
                            />
                        </div>

                        {/* Content */}
                        <div className="mb-6 text-center">
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                                Sesi Telah Berakhir
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                Sesi login Anda telah kedaluwarsa. Halaman akan
                                di-refresh otomatis untuk mendapatkan token
                                baru.
                            </p>
                        </div>

                        {/* Countdown ring */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative h-16 w-16">
                                {/* Background circle */}
                                <svg
                                    className="h-16 w-16 -rotate-90 transform"
                                    viewBox="0 0 64 64"
                                >
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        className="text-slate-200 dark:text-slate-700"
                                    />
                                    {/* Animated countdown circle */}
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        className="text-[#5B8FAF]"
                                        strokeDasharray={`${(countdown / 5) * 175.93} 175.93`}
                                        style={{
                                            transition:
                                                'stroke-dasharray 1s linear',
                                        }}
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#5B8FAF]">
                                    {countdown}
                                </span>
                            </div>
                        </div>

                        {/* Refresh button */}
                        <button
                            onClick={handleRefreshNow}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A7A9B] to-[#5B8FAF] px-4 py-3 font-semibold text-white shadow-lg shadow-[#5B8FAF]/25 transition-all duration-200 hover:from-[#3D6B8A] hover:to-[#4A7A9B] hover:shadow-[#5B8FAF]/40 active:scale-[0.98]"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Refresh Sekarang
                        </button>

                        {/* Auto-refresh hint */}
                        <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
                            Refresh otomatis dalam {countdown} detik...
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modal-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                .animate-modal-in {
                    animation: modal-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
