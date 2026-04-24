import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div
            className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10"
            style={{
                background:
                    'linear-gradient(135deg, #e8f0f8 0%, #f0f4f8 25%, #ffffff 50%, #f0f4f8 75%, #e8f0f8 100%)',
            }}
        >
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Top-left circle */}
                <div
                    className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-[0.07]"
                    style={{
                        background:
                            'radial-gradient(circle, #4A7FB5, transparent 70%)',
                    }}
                />
                {/* Bottom-right circle */}
                <div
                    className="absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full opacity-[0.06]"
                    style={{
                        background:
                            'radial-gradient(circle, #5B8DB8, transparent 70%)',
                    }}
                />
                {/* Middle accent */}
                <div
                    className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full opacity-[0.04]"
                    style={{
                        background:
                            'radial-gradient(circle, #6B9AC4, transparent 70%)',
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    {/* Card wrapper */}
                    <div className="rounded-2xl border border-white/60 bg-white/80 px-8 py-10 shadow-xl shadow-[#4A7FB5]/5 backdrop-blur-sm">
                        {/* Logo + Header */}
                        <div className="mb-8 flex flex-col items-center gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium transition-transform hover:scale-105"
                            >
                                <img
                                    src="/Logo.png"
                                    alt="nathBid"
                                    className="h-24 w-auto object-contain drop-shadow-md"
                                />
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1
                                    className="text-xl font-semibold"
                                    style={{ color: '#2c5f8a' }}
                                >
                                    {title}
                                </h1>
                                <p
                                    className="text-center text-sm"
                                    style={{ color: '#6B9AC4' }}
                                >
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Form area with themed styles */}
                        <style>{`
                            /* Themed login inputs */
                            .auth-themed input[type="email"],
                            .auth-themed input[type="password"],
                            .auth-themed input[type="text"] {
                                border-color: #c5d9eb !important;
                                transition: all 0.2s ease;
                            }
                            .auth-themed input[type="email"]:focus,
                            .auth-themed input[type="password"]:focus,
                            .auth-themed input[type="text"]:focus {
                                border-color: #4A7FB5 !important;
                                box-shadow: 0 0 0 3px rgba(74, 127, 181, 0.15) !important;
                                outline: none !important;
                            }
                            /* Themed primary button */
                            .auth-themed button[type="submit"],
                            .auth-themed button[data-test="login-button"] {
                                background: linear-gradient(135deg, #4A7FB5 0%, #5B8DB8 50%, #3d6d9e 100%) !important;
                                border: none !important;
                                color: white !important;
                                font-weight: 600 !important;
                                border-radius: 0.75rem !important;
                                transition: all 0.3s ease !important;
                                box-shadow: 0 4px 14px rgba(74, 127, 181, 0.3) !important;
                            }
                            .auth-themed button[type="submit"]:hover,
                            .auth-themed button[data-test="login-button"]:hover {
                                background: linear-gradient(135deg, #3d6d9e 0%, #4A7FB5 50%, #5B8DB8 100%) !important;
                                box-shadow: 0 6px 20px rgba(74, 127, 181, 0.4) !important;
                                transform: translateY(-1px) !important;
                            }
                            .auth-themed button[type="submit"]:active,
                            .auth-themed button[data-test="login-button"]:active {
                                transform: translateY(0) !important;
                            }
                            /* Themed checkbox */
                            .auth-themed button[role="checkbox"][data-state="checked"] {
                                background-color: #4A7FB5 !important;
                                border-color: #4A7FB5 !important;
                            }
                            /* Themed links */
                            .auth-themed a {
                                color: #4A7FB5 !important;
                                transition: color 0.2s ease;
                            }
                            .auth-themed a:hover {
                                color: #3d6d9e !important;
                            }
                            /* Labels */
                            .auth-themed label {
                                color: #2c5f8a;
                                font-weight: 500;
                            }
                        `}</style>
                        <div className="auth-themed">{children}</div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                        className="mx-auto h-1 w-16 rounded-full"
                        style={{
                            background:
                                'linear-gradient(90deg, #4A7FB5, #6B9AC4, #4A7FB5)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
