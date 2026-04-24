import { Head, useForm, usePage } from '@inertiajs/react';
import {
    UserPlus,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    Trash2,
    X,
    Mail,
    User,
    Lock,
    Shield,
    KeyRound,
    MoreHorizontal,
    Hash,
    Clock,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Admin {
    id: number;
    name: string;
    email: string;
    pin: string;
    is_online: boolean;
    created_at: string;
    created_at_human: string;
}

interface Props {
    admins: Admin[];
}

export default function AdminsIndex({ admins }: Props) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showResetPasswordConfirm, setShowResetPasswordConfirm] =
        useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props as { flash: { success?: string; error?: string } };

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const resetForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const deleteForm = useForm({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/users/admins', {
            onSuccess: () => {
                form.reset();
                setShowCreateForm(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        deleteForm.delete(`/admin/users/admins/${id}`, {
            onSuccess: () => setDeletingId(null),
        });
    };

    const handleResetPassword = (id: number) => {
        resetForm.post(`/admin/users/admins/${id}/reset-password`, {
            onSuccess: () => {
                setResetPasswordId(null);
                resetForm.reset();
                setShowResetPassword(false);
                setShowResetPasswordConfirm(false);
            },
        });
    };

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

    const onlineCount = admins.filter((a) => a.is_online).length;
    const offlineCount = admins.filter((a) => !a.is_online).length;

    return (
        <AppLayout>
            <Head title="Kelola Admin" />

            <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-5 flex animate-in items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 duration-300 fade-in slide-in-from-top-2 dark:border-green-800 dark:bg-green-900/20">
                        <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                            {flash.success}
                        </p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-5 flex animate-in items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 duration-300 fade-in slide-in-from-top-2 dark:border-red-800 dark:bg-red-900/20">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">
                            {flash.error}
                        </p>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Kelola Admin
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Kelola akun administrator sistem
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowCreateForm(!showCreateForm);
                            if (showCreateForm) form.reset();
                        }}
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                        style={{
                            background: showCreateForm
                                ? '#64748b'
                                : 'linear-gradient(135deg, #4A7FB5 0%, #3d6d9e 100%)',
                        }}
                    >
                        {showCreateForm ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <UserPlus className="h-4 w-4" />
                        )}
                        {showCreateForm ? 'Tutup' : 'Tambah Admin'}
                    </button>
                </div>

                {/* Create Admin Form */}
                {showCreateForm && (
                    <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div
                            className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-700"
                            style={{
                                background:
                                    'linear-gradient(135deg, #f8fbff 0%, #f0f6fc 100%)',
                            }}
                        >
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-lg"
                                style={{
                                    backgroundColor: 'rgba(74, 127, 181, 0.12)',
                                }}
                            >
                                <UserPlus
                                    className="h-4.5 w-4.5"
                                    style={{ color: '#4A7FB5' }}
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Buat Admin Baru
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Langsung aktif tanpa verifikasi email
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                        Nama
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={form.data.name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama lengkap"
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-10 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#4A7FB5] focus:bg-white focus:ring-2 focus:ring-[#4A7FB5]/15 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    {form.errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={form.data.email}
                                            onChange={(e) =>
                                                form.setData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="admin@example.com"
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-10 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#4A7FB5] focus:bg-white focus:ring-2 focus:ring-[#4A7FB5]/15 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    {form.errors.email && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {form.errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={form.data.password}
                                            onChange={(e) =>
                                                form.setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Min. 8 karakter"
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-10 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#4A7FB5] focus:bg-white focus:ring-2 focus:ring-[#4A7FB5]/15 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {form.errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {form.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                        Konfirmasi Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={
                                                showPasswordConfirm
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={
                                                form.data.password_confirmation
                                            }
                                            onChange={(e) =>
                                                form.setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ulangi password"
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-10 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#4A7FB5] focus:bg-white focus:ring-2 focus:ring-[#4A7FB5]/15 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswordConfirm(
                                                    !showPasswordConfirm,
                                                )
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswordConfirm ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Shield className="h-3.5 w-3.5 text-[#4A7FB5]" />
                                    Akun langsung aktif tanpa verifikasi
                                </div>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium text-white transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #4A7FB5 0%, #3d6d9e 100%)',
                                    }}
                                >
                                    {form.processing ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        <UserPlus className="h-4 w-4" />
                                    )}
                                    Buat Admin
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Stats Row */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div
                                className="rounded-lg p-2"
                                style={{
                                    backgroundColor: 'rgba(74, 127, 181, 0.08)',
                                }}
                            >
                                <Users
                                    className="h-5 w-5"
                                    style={{ color: '#4A7FB5' }}
                                />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {admins.length}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Total Admin
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                                <div className="flex h-5 w-5 items-center justify-center">
                                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {onlineCount}
                                </p>
                                <p className="text-xs text-gray-500">Online</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
                                <div className="flex h-5 w-5 items-center justify-center">
                                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-500" />
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {offlineCount}
                                </p>
                                <p className="text-xs text-gray-500">Offline</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin List */}
                {admins.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center dark:border-gray-600 dark:bg-gray-800">
                        <Users className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            Belum ada admin
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Buat akun admin pertama dengan tombol di atas
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                        {/* Table Head */}
                        <div className="hidden gap-4 rounded-t-xl border-b border-gray-100 bg-gray-50/80 px-5 py-3 md:grid md:grid-cols-12 dark:border-gray-700 dark:bg-gray-900/30">
                            <span className="col-span-5 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                                Admin
                            </span>
                            <span className="col-span-2 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                                PIN
                            </span>
                            <span className="col-span-2 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                                Status
                            </span>
                            <span className="col-span-2 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                                Bergabung
                            </span>
                            <span className="col-span-1 text-right text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                                Aksi
                            </span>
                        </div>

                        {admins.map((admin, idx) => (
                            <div
                                key={admin.id}
                                className={`group relative px-5 py-3.5 transition-colors hover:bg-gray-50/70 md:grid md:grid-cols-12 md:items-center md:gap-4 dark:hover:bg-gray-800/50 ${
                                    idx !== admins.length - 1
                                        ? 'border-b border-gray-100 dark:border-gray-700/50'
                                        : ''
                                }`}
                            >
                                {/* Avatar + Info */}
                                <div className="col-span-5 mb-2 flex items-center gap-3 md:mb-0">
                                    <div className="relative shrink-0">
                                        <div
                                            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #4A7FB5, #3d6d9e)',
                                            }}
                                        >
                                            {getInitials(admin.name)}
                                        </div>
                                        <span
                                            className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                                                admin.is_online
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-300 dark:bg-gray-500'
                                            }`}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                            {admin.name}
                                        </p>
                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                            {admin.email}
                                        </p>
                                    </div>
                                </div>

                                {/* PIN */}
                                <div className="col-span-2 mb-1 md:mb-0">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                        <Hash className="h-3 w-3" />
                                        {admin.pin}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="col-span-2 mb-1 md:mb-0">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                            admin.is_online
                                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${admin.is_online ? 'bg-green-500' : 'bg-gray-400'}`}
                                        />
                                        {admin.is_online ? 'Online' : 'Offline'}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="col-span-2 mb-1 md:mb-0">
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <Clock className="h-3 w-3 shrink-0" />
                                        <span className="truncate">
                                            {admin.created_at_human}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex justify-end">
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenuId(
                                                    openMenuId === admin.id
                                                        ? null
                                                        : admin.id,
                                                )
                                            }
                                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>

                                        {/* Dropdown */}
                                        {openMenuId === admin.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() =>
                                                        setOpenMenuId(null)
                                                    }
                                                />
                                                <div className="absolute top-full right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                                    <button
                                                        onClick={() => {
                                                            setResetPasswordId(
                                                                admin.id,
                                                            );
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    >
                                                        <KeyRound className="h-4 w-4 text-amber-500" />
                                                        Reset Password
                                                    </button>
                                                    <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                                                    <button
                                                        onClick={() => {
                                                            setDeletingId(
                                                                admin.id,
                                                            );
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Hapus Admin
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* === MODALS === */}

                {/* Delete Modal */}
                {deletingId !== null && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                                <Trash2 className="h-7 w-7 text-red-500" />
                            </div>
                            <h3 className="mb-1 text-center text-lg font-bold text-gray-900 dark:text-white">
                                Hapus Admin
                            </h3>
                            <p className="mb-5 text-center text-sm text-gray-500 dark:text-gray-400">
                                Hapus{' '}
                                <strong>
                                    {
                                        admins.find((a) => a.id === deletingId)
                                            ?.name
                                    }
                                </strong>{' '}
                                secara permanen?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeletingId(null)}
                                    className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleDelete(deletingId)}
                                    disabled={deleteForm.processing}
                                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                                >
                                    {deleteForm.processing ? (
                                        <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        'Hapus'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reset Password Modal */}
                {resetPasswordId !== null && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                            <div
                                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: 'rgba(74, 127, 181, 0.1)',
                                }}
                            >
                                <KeyRound
                                    className="h-7 w-7"
                                    style={{ color: '#4A7FB5' }}
                                />
                            </div>
                            <h3 className="mb-1 text-center text-lg font-bold text-gray-900 dark:text-white">
                                Reset Password
                            </h3>
                            <p className="mb-5 text-center text-sm text-gray-500 dark:text-gray-400">
                                Buat password baru untuk{' '}
                                <strong>
                                    {
                                        admins.find(
                                            (a) => a.id === resetPasswordId,
                                        )?.name
                                    }
                                </strong>
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                        Password Baru
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={
                                                showResetPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={resetForm.data.password}
                                            onChange={(e) =>
                                                resetForm.setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Min. 8 karakter"
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-10 text-sm transition-all focus:border-[#4A7FB5] focus:bg-white focus:ring-2 focus:ring-[#4A7FB5]/15 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowResetPassword(
                                                    !showResetPassword,
                                                )
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showResetPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {resetForm.errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {resetForm.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                        Konfirmasi
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={
                                                showResetPasswordConfirm
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={
                                                resetForm.data
                                                    .password_confirmation
                                            }
                                            onChange={(e) =>
                                                resetForm.setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ulangi password baru"
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-10 text-sm transition-all focus:border-[#4A7FB5] focus:bg-white focus:ring-2 focus:ring-[#4A7FB5]/15 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowResetPasswordConfirm(
                                                    !showResetPasswordConfirm,
                                                )
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showResetPasswordConfirm ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex gap-3">
                                <button
                                    onClick={() => {
                                        setResetPasswordId(null);
                                        resetForm.reset();
                                        setShowResetPassword(false);
                                        setShowResetPasswordConfirm(false);
                                    }}
                                    className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() =>
                                        handleResetPassword(resetPasswordId)
                                    }
                                    disabled={
                                        resetForm.processing ||
                                        !resetForm.data.password ||
                                        !resetForm.data.password_confirmation
                                    }
                                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #4A7FB5 0%, #3d6d9e 100%)',
                                    }}
                                >
                                    {resetForm.processing ? (
                                        <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        'Simpan Password'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
