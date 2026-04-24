import { Head, Link } from '@inertiajs/react';

interface ErrorPageProps {
    code: number;
    title: string;
    message: string;
    actions?: { label: string; href: string; primary?: boolean }[];
}

export default function ErrorPage({ code, title, message, actions }: ErrorPageProps) {
    const defaultActions = [
        { label: '← Kembali ke Beranda', href: '/', primary: true },
    ];
    const pageActions = actions || defaultActions;

    return (
        <>
            <Head title={`${code} - ${title}`} />
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0f0f14] p-6">
                {/* Background grid */}
                <div
                    className="pointer-events-none fixed inset-0"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Glow effects */}
                <div className="pointer-events-none fixed -left-32 -top-48 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
                <div className="pointer-events-none fixed -bottom-48 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />

                {/* Content */}
                <div className="relative z-10 w-full max-w-md text-center">
                    {/* Error Code */}
                    <h1
                        className="mb-2 text-[8rem] font-black leading-none tracking-tight sm:text-[10rem]"
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #a78bfa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {code}
                    </h1>

                    {/* Divider */}
                    <div className="mx-auto mb-6 h-[3px] w-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />

                    {/* Title */}
                    <h2 className="mb-3 text-xl font-bold text-gray-100 sm:text-2xl">
                        {title}
                    </h2>

                    {/* Message */}
                    <p className="mb-8 text-base leading-relaxed text-gray-400">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {pageActions.map((action, i) => (
                            action.href.startsWith('javascript:') || action.href === '#reload' ? (
                                <button
                                    key={i}
                                    onClick={() => window.location.reload()}
                                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                                        action.primary
                                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/40'
                                            : 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    {action.label}
                                </button>
                            ) : (
                                <Link
                                    key={i}
                                    href={action.href}
                                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                                        action.primary
                                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/40'
                                            : 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    {action.label}
                                </Link>
                            )
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="absolute bottom-6 text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} - Aplikasi Lelang
                </p>
            </div>
        </>
    );
}
