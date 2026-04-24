import { Head, router } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { login } from '@/routes';
import { useState, useEffect, useRef, FormEvent, KeyboardEvent, ClipboardEvent } from 'react';
import {
    Eye, EyeOff, Mail, CheckCircle, XCircle, RefreshCw, Clock,
    ShieldCheck, ArrowRight, ArrowLeft, User, Lock, Sparkles
} from 'lucide-react';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';

const STEPS = [
    { label: 'Nama', icon: User },
    { label: 'Email', icon: Mail },
    { label: 'Password', icon: Lock },
    { label: 'Verifikasi', icon: ShieldCheck },
];

export default function Register() {
    const [step, setStep] = useState(0);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // OTP state
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otpMessage, setOtpMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [countdown, setCountdown] = useState(0);
    const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);

    // Form processing
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [stepErrors, setStepErrors] = useState<string>('');

    // Success state
    const [success, setSuccess] = useState(false);

    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // Focus input on step change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (step === 0) nameRef.current?.focus();
            else if (step === 1) emailRef.current?.focus();
            else if (step === 2) passwordRef.current?.focus();
            else if (step === 3 && otpSent) otpInputRefs.current[0]?.focus();
        }, 300);
        return () => clearTimeout(timer);
    }, [step, otpSent]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    // Validation per step
    const validateStep = (): boolean => {
        setStepErrors('');
        if (step === 0) {
            if (!name.trim()) { setStepErrors('Nama wajib diisi.'); return false; }
            if (name.trim().length < 2) { setStepErrors('Nama minimal 2 karakter.'); return false; }
        }
        if (step === 1) {
            if (!email.trim()) { setStepErrors('Email wajib diisi.'); return false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStepErrors('Format email tidak valid.'); return false; }
        }
        if (step === 2) {
            if (!password) { setStepErrors('Password wajib diisi.'); return false; }
            if (password.length < 8) { setStepErrors('Password minimal 8 karakter.'); return false; }
            if (password !== passwordConfirmation) { setStepErrors('Konfirmasi password tidak cocok.'); return false; }
        }
        return true;
    };

    const nextStep = () => {
        if (!validateStep()) return;
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        setStepErrors('');
        if (step > 0) setStep(step - 1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && step < 3) {
            e.preventDefault();
            nextStep();
        }
    };

    // OTP handlers
    const handleSendOtp = async () => {
        if (!email) return;

        setOtpSending(true);
        setOtpMessage(null);

        try {
            const response = await fetch('/otp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpSent(true);
                setOtpMessage({ type: 'success', text: data.message });
                setCountdown(60);
                setOtpVerified(false);
                setOtpCode('');
                setOtpDigits(['', '', '', '', '', '']);
                setTimeout(() => otpInputRefs.current[0]?.focus(), 300);
            } else {
                setOtpMessage({ type: 'error', text: data.message });
                if (data.seconds_left) setCountdown(data.seconds_left);
            }
        } catch {
            setOtpMessage({ type: 'error', text: 'Gagal mengirim OTP. Coba lagi.' });
        } finally {
            setOtpSending(false);
        }
    };

    const handleDigitChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newDigits = [...otpDigits];
        newDigits[index] = value;
        setOtpDigits(newDigits);
        setOtpCode(newDigits.join(''));
        setOtpVerified(false);
        if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
    };

    const handleDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleDigitPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) newDigits[i] = pasted[i] || '';
        setOtpDigits(newDigits);
        setOtpCode(newDigits.join(''));
        otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleVerifyOtp = async () => {
        const code = otpDigits.join('');
        if (code.length !== 6) {
            setOtpMessage({ type: 'error', text: 'Masukkan 6 digit kode OTP.' });
            return;
        }

        setOtpVerifying(true);
        setOtpMessage(null);

        try {
            const response = await fetch('/otp/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, otp_code: code }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpVerified(true);
                setOtpMessage({ type: 'success', text: 'OTP terverifikasi!' });
                // Auto-submit registration
                handleSubmit(code);
            } else {
                setOtpVerified(false);
                setOtpMessage({ type: 'error', text: data.message });
            }
        } catch {
            setOtpMessage({ type: 'error', text: 'Gagal memverifikasi OTP.' });
        } finally {
            setOtpVerifying(false);
        }
    };

    const handleSubmit = (otpCodeFinal?: string) => {
        setProcessing(true);
        setErrors({});

        router.post('/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            otp_code: otpCodeFinal || otpCode,
        }, {
            onSuccess: () => {
                setSuccess(true);
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
                if (err.otp_code) {
                    setOtpVerified(false);
                    setOtpMessage({ type: 'error', text: err.otp_code });
                }
                if (err.name) setStep(0);
                else if (err.email) setStep(1);
                else if (err.password) setStep(2);
            },
        });
    };

    const formatCountdown = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Step descriptions for left panel
    const stepInfo = [
        {
            title: 'Buat Akun Anda',
            subtitle: 'Mulai perjalanan Anda bersama kami',
            description: 'Bergabunglah dengan komunitas nathBid dan nikmati berbagai layanan lelang eksklusif yang telah kami siapkan untuk Anda.',
        },
        {
            title: 'Alamat Email',
            subtitle: 'Gunakan email aktif Anda',
            description: 'Email akan digunakan untuk login, menerima notifikasi penting, dan memverifikasi identitas akun Anda.',
        },
        {
            title: 'Keamanan Akun',
            subtitle: 'Lindungi akun Anda',
            description: 'Buat password yang kuat dengan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk keamanan maksimal.',
        },
        {
            title: 'Verifikasi Email',
            subtitle: 'Satu langkah lagi',
            description: 'Kami akan mengirimkan kode OTP ke email Anda. Masukkan kode tersebut untuk memverifikasi kepemilikan email.',
        },
    ];

    // Success screen
    if (success) {
        return (
            <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
                <Head title="Registrasi Berhasil" />
                <div className="w-full max-w-lg text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-200 dark:shadow-green-900/30">
                        <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                        Selamat Datang! 🎉
                    </h1>
                    <p className="mb-10 text-lg text-gray-500 dark:text-gray-400">
                        Akun Anda berhasil dibuat. Anda akan diarahkan ke dashboard.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
            <Head title="Buat Akun — nathBid" />

            <div className="w-full max-w-5xl">

                {/* Main Card — Two Column */}
                <div className="overflow-hidden rounded-3xl border border-gray-200/60 bg-white/90 shadow-2xl shadow-gray-200/60 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/90 dark:shadow-gray-900/60">
                    <div className="flex flex-col lg:flex-row">

                        {/* Left Panel — Branding & Info */}
                        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4A7FB5] via-[#5B8DB8] to-[#3D6E99] p-8 lg:w-[420px] lg:p-10">
                            {/* Background decoration */}
                            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                                <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5"></div>
                                <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-white/5"></div>
                                <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5"></div>
                                <div className="absolute top-20 right-10 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
                                <div className="absolute bottom-32 left-8 h-16 w-16 rounded-full bg-sky-300/20 blur-lg"></div>
                            </div>

                            <div className="relative z-10">
                                {/* Logo */}
                                <div className="mb-5 flex justify-center">
                                    <Link href={home()}>
                                        <img src="/Logo.png" alt="nathBid" className="h-42 w-auto brightness-0 invert" />
                                    </Link>
                                </div>

                                {/* Step counter */}
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-xs font-bold">
                                        {step + 1}
                                    </span>
                                    Langkah {step + 1} dari {STEPS.length}
                                </div>

                                {/* Dynamic title */}
                                <h1 className="mb-3 text-3xl font-bold leading-tight text-white lg:text-4xl">
                                    {stepInfo[step].title}
                                </h1>
                                <p className="mb-2 text-lg font-medium text-white/80">
                                    {stepInfo[step].subtitle}
                                </p>
                                <p className="text-sm leading-relaxed text-white/60">
                                    {stepInfo[step].description}
                                </p>
                            </div>

                            {/* Step progress dots */}
                            <div className="relative z-10 mt-8 flex items-center gap-3 lg:mt-auto lg:pt-10">
                                {STEPS.map((s, i) => {
                                    const isActive = i === step;
                                    const isCompleted = i < step;
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center rounded-full transition-all duration-500 ${
                                                isCompleted
                                                    ? 'h-10 w-10 bg-white/25 backdrop-blur-sm'
                                                    : isActive
                                                        ? 'h-10 w-10 bg-white shadow-lg shadow-white/20'
                                                        : 'h-10 w-10 bg-white/10'
                                            }`}>
                                                {isCompleted ? (
                                                    <CheckCircle className="h-5 w-5 text-white" />
                                                ) : (
                                                    <s.icon className={`h-5 w-5 ${isActive ? 'text-[#4A7FB5]' : 'text-white/40'}`} />
                                                )}
                                            </div>
                                            {i < 3 && (
                                                <div className={`hidden h-0.5 w-6 rounded-full transition-colors duration-500 lg:block ${
                                                    i < step ? 'bg-white/40' : 'bg-white/10'
                                                }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Logo on left panel */}
                            <div className="relative z-10 mt-0 mb-0 hidden lg:flex justify-center">
                                <img
                                    src="/Logo.png"
                                    alt="nathBid"
                                    className="h-42 w-auto brightness-0 invert opacity-20"
                                />
                            </div>
                        </div>

                        {/* Right Panel — Form */}
                        <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                            {/* Step Indicator (mobile-visible, desktop-hidden) */}
                            <div className="mb-6 flex items-center justify-between lg:hidden">
                                {STEPS.map((s, i) => {
                                    const Icon = s.icon;
                                    const isActive = i === step;
                                    const isCompleted = i < step;
                                    return (
                                        <div key={i} className="flex flex-1 items-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                                                    isCompleted
                                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-sm shadow-green-200 dark:shadow-green-900/30'
                                                        : isActive
                                                            ? 'bg-gradient-to-br from-[#4A7FB5] to-[#3D6E99] text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/30'
                                                            : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                                }`}>
                                                    {isCompleted ? (
                                                        <CheckCircle className="h-4.5 w-4.5" />
                                                    ) : (
                                                        <Icon className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <span className={`text-[10px] font-medium transition-colors ${
                                                    isActive ? 'text-[#4A7FB5] dark:text-sky-400'
                                                    : isCompleted ? 'text-green-600 dark:text-green-400'
                                                    : 'text-gray-400 dark:text-gray-500'
                                                }`}>
                                                    {s.label}
                                                </span>
                                            </div>
                                            {i < 3 && (
                                                <div className={`mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                                                    i < step ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                                                }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Form Header (desktop) */}
                            <div className="mb-8 hidden lg:block">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Buat Akun Baru
                                </h2>
                                <p className="mt-1.5 text-gray-500 dark:text-gray-400">
                                    Isi data berikut untuk membuat akun Anda
                                </p>
                            </div>

                            {/* Step Content */}
                            <div className="min-h-[280px]">
                                {/* Step 0: Name */}
                                {step === 0 && (
                                    <div className="space-y-6" onKeyDown={handleKeyDown}>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white lg:text-2xl">
                                                Siapa nama Anda?
                                            </h2>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 lg:text-base">
                                                Nama ini akan ditampilkan di profil Anda
                                            </p>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                ref={nameRef}
                                                type="text"
                                                value={name}
                                                onChange={(e) => { setName(e.target.value); setStepErrors(''); }}
                                                placeholder="Masukkan nama lengkap"
                                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 text-base text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#4A7FB5] focus:ring-4 focus:ring-sky-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-sky-400 dark:focus:ring-sky-900/30"
                                            />
                                            {stepErrors && <p className="mt-2 text-sm text-red-500">{stepErrors}</p>}
                                            {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Step 1: Email */}
                                {step === 1 && (
                                    <div className="space-y-6" onKeyDown={handleKeyDown}>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white lg:text-2xl">
                                                Apa email Anda?
                                            </h2>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 lg:text-base">
                                                Email digunakan untuk login dan verifikasi
                                            </p>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Alamat Email
                                            </label>
                                            <input
                                                ref={emailRef}
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setStepErrors('');
                                                    // Reset OTP if email changes
                                                    setOtpSent(false);
                                                    setOtpVerified(false);
                                                    setOtpDigits(['', '', '', '', '', '']);
                                                    setOtpCode('');
                                                    setOtpMessage(null);
                                                }}
                                                placeholder="email@example.com"
                                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 text-base text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#4A7FB5] focus:ring-4 focus:ring-sky-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-sky-400 dark:focus:ring-sky-900/30"
                                            />
                                            {stepErrors && <p className="mt-2 text-sm text-red-500">{stepErrors}</p>}
                                            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Password */}
                                {step === 2 && (
                                    <div className="space-y-6" onKeyDown={handleKeyDown}>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white lg:text-2xl">
                                                Buat password Anda
                                            </h2>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 lg:text-base">
                                                Minimal 8 karakter untuk keamanan
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        ref={passwordRef}
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => { setPassword(e.target.value); setStepErrors(''); }}
                                                        placeholder="Buat password"
                                                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 pr-12 text-base text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#4A7FB5] focus:ring-4 focus:ring-sky-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-sky-400 dark:focus:ring-sky-900/30"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Konfirmasi Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirm ? 'text' : 'password'}
                                                        value={passwordConfirmation}
                                                        onChange={(e) => { setPasswordConfirmation(e.target.value); setStepErrors(''); }}
                                                        placeholder="Ulangi password"
                                                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 pr-12 text-base text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#4A7FB5] focus:ring-4 focus:ring-sky-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-sky-400 dark:focus:ring-sky-900/30"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirm(!showConfirm)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                    >
                                                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            {stepErrors && <p className="text-sm text-red-500">{stepErrors}</p>}
                                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                        </div>

                                        {/* Password strength hints */}
                                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                                            <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Tips password yang kuat:
                                            </p>
                                            <ul className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                                                    {password.length >= 8 ? <CheckCircle className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />}
                                                    Minimal 8 karakter
                                                </li>
                                                <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                                    {/[A-Z]/.test(password) ? <CheckCircle className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />}
                                                    Mengandung huruf besar
                                                </li>
                                                <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                                    {/[0-9]/.test(password) ? <CheckCircle className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />}
                                                    Mengandung angka
                                                </li>
                                                <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                                    {/[^A-Za-z0-9]/.test(password) ? <CheckCircle className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />}
                                                    Mengandung simbol (!@#$)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: OTP */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white lg:text-2xl">
                                                Verifikasi email Anda
                                            </h2>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 lg:text-base">
                                                Kode OTP akan dikirim ke <span className="font-semibold text-[#4A7FB5] dark:text-sky-400">{email}</span>
                                            </p>
                                        </div>

                                        {!otpSent ? (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={otpSending}
                                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:from-[#3D6E99] hover:to-[#4A7FB5] hover:shadow-xl disabled:opacity-50 dark:shadow-blue-900/30"
                                            >
                                                {otpSending ? (
                                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <Mail className="h-5 w-5" />
                                                )}
                                                {otpSending ? 'Mengirim...' : 'Kirim Kode OTP'}
                                            </button>
                                        ) : (
                                            <div className="space-y-5">
                                                {!otpVerified && (
                                                    <>
                                                        {/* 6 Box inputs */}
                                                        <div className="flex justify-center gap-3">
                                                            {otpDigits.map((digit, index) => (
                                                                <input
                                                                    key={index}
                                                                    ref={(el) => { otpInputRefs.current[index] = el; }}
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    maxLength={1}
                                                                    value={digit}
                                                                    onChange={(e) => handleDigitChange(index, e.target.value)}
                                                                    onKeyDown={(e) => handleDigitKeyDown(index, e)}
                                                                    onPaste={index === 0 ? handleDigitPaste : undefined}
                                                                    className="h-16 w-14 rounded-xl border-2 border-gray-200 bg-white text-center text-2xl font-bold text-gray-900 shadow-sm outline-none transition-all focus:border-[#4A7FB5] focus:ring-4 focus:ring-sky-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-900/30"
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* Verify button */}
                                                        <button
                                                            type="button"
                                                            onClick={handleVerifyOtp}
                                                            disabled={otpVerifying || otpDigits.join('').length !== 6 || processing}
                                                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-green-200 transition-all hover:from-emerald-600 hover:to-green-600 hover:shadow-xl disabled:opacity-50 dark:shadow-green-900/30"
                                                        >
                                                            {(otpVerifying || processing) ? (
                                                                <RefreshCw className="h-5 w-5 animate-spin" />
                                                            ) : (
                                                                <ShieldCheck className="h-5 w-5" />
                                                            )}
                                                            {processing ? 'Membuat akun...' : otpVerifying ? 'Memverifikasi...' : 'Verifikasi & Buat Akun'}
                                                        </button>
                                                    </>
                                                )}

                                                {/* Verified */}
                                                {otpVerified && (
                                                    <div className="flex items-center justify-center gap-3 rounded-xl bg-green-50 py-4 text-base font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        <CheckCircle className="h-5 w-5" />
                                                        OTP Terverifikasi — Membuat akun...
                                                    </div>
                                                )}

                                                {/* Countdown & Resend */}
                                                {!otpVerified && (
                                                    <div className="flex items-center justify-center">
                                                        {countdown > 0 ? (
                                                            <span className="flex items-center gap-2 text-sm text-gray-400">
                                                                <Clock className="h-4 w-4" />
                                                                Kirim ulang dalam {formatCountdown(countdown)}
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={handleSendOtp}
                                                                disabled={otpSending}
                                                                className="flex items-center gap-2 text-sm font-medium text-[#4A7FB5] hover:text-[#3D6E99] dark:text-sky-400 transition-colors"
                                                            >
                                                                <RefreshCw className={`h-4 w-4 ${otpSending ? 'animate-spin' : ''}`} />
                                                                Kirim Ulang OTP
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* OTP Message */}
                                        {otpMessage && (
                                            <p className={`text-center text-sm font-medium ${
                                                otpMessage.type === 'success'
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-500 dark:text-red-400'
                                            }`}>
                                                {otpMessage.text}
                                            </p>
                                        )}
                                        {errors.otp_code && (
                                            <p className="text-center text-sm text-red-500">{errors.otp_code}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex items-center gap-4">
                                {step > 0 && step < 3 || (step === 3 && !otpSent) ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Kembali
                                    </button>
                                ) : null}

                                {step < 3 && (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:from-[#3D6E99] hover:to-[#4A7FB5] hover:shadow-xl dark:shadow-blue-900/30"
                                    >
                                        Lanjut
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Divider & Login link */}
                            <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-700/50">
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                    Sudah punya akun?{' '}
                                    <TextLink href={login()} className="font-semibold text-[#4A7FB5] hover:text-[#3D6E99] dark:text-sky-400">
                                        Masuk di sini
                                    </TextLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <span>© {new Date().getFullYear()} nathBid</span>
                    <span>•</span>
                    <span>Privasi</span>
                    <span>•</span>
                    <span>Ketentuan</span>
                </div>
            </div>
        </div>
    );
}
