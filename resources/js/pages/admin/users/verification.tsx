import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    UserCheck,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Mail,
    Shield,
    Calendar,
    Hash,
    User,
    Sparkles,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface PendingUser {
    id: number;
    name: string;
    email: string;
    pin: string;
    role: string;
    created_at: string;
    created_at_human: string;
}

interface Props {
    pendingUsers: PendingUser[];
}

export default function UserVerification({ pendingUsers }: Props) {
    const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [rejectNote, setRejectNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApprove = (user: PendingUser) => {
        setSelectedUser(user);
        setAction('approve');
    };

    const handleReject = (user: PendingUser) => {
        setSelectedUser(user);
        setAction('reject');
        setRejectNote('');
    };

    const handleConfirm = () => {
        if (!selectedUser || !action) return;

        setIsProcessing(true);
        const url =
            action === 'approve'
                ? `/admin/users/${selectedUser.id}/approve`
                : `/admin/users/${selectedUser.id}/reject`;

        router.post(
            url,
            action === 'reject' ? { note: rejectNote } : {},
            {
                onFinish: () => {
                    setIsProcessing(false);
                    setSelectedUser(null);
                    setAction(null);
                    setRejectNote('');
                },
            },
        );
    };

    const handleCancel = () => {
        setSelectedUser(null);
        setAction(null);
        setRejectNote('');
    };

    // Generate avatar initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate random gradient for avatar
    const getAvatarGradient = (id: number) => {
        const gradients = [
            'from-[#4A7FB5] to-[#3d6d9e]',
            'from-[#5B8DB8] to-[#4A7FB5]',
            'from-[#3d6d9e] to-[#2c5f8a]',
            'from-[#6B9AC4] to-[#4A7FB5]',
            'from-[#4A7FB5] to-[#5B8DB8]',
            'from-[#2c5f8a] to-[#4A7FB5]',
        ];
        return gradients[id % gradients.length];
    };

    return (
        <AppLayout>
            <Head title="Verifikasi User - Admin" />

            <div className="min-h-screen p-6 lg:p-8">
                {/* Header with gradient */}
                <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A7FB5] via-[#3d6d9e] to-[#2c5f8a] p-8 text-white shadow-2xl">
                    <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                <UserCheck className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Verifikasi User
                                </h1>
                                <p className="mt-1 text-white/80">
                                    Kelola dan verifikasi pendaftaran akun baru dari pengguna
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <Clock className="h-5 w-5 text-yellow-300" />
                                <div>
                                    <p className="text-2xl font-bold">{pendingUsers.length}</p>
                                    <p className="text-xs text-white/70">Menunggu Verifikasi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users List */}
                {pendingUsers.length === 0 ? (
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f0f6fc] to-[#e0edf8] py-20 text-center dark:from-[#4A7FB5]/10 dark:to-[#3d6d9e]/10">
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(74,127,181,0.12) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        
                        <div className="relative z-10">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#4A7FB5] to-[#3d6d9e] shadow-lg shadow-[#4A7FB5]/30">
                                <Sparkles className="h-12 w-12 text-white" />
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white">
                                Semua Sudah Terverifikasi! 🎉
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tidak ada user yang perlu diverifikasi saat ini
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {pendingUsers.map((user) => (
                            <div
                                key={user.id}
                                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                            >
                                {/* Pending Badge */}
                                <div className="absolute right-4 top-4">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#4A7FB5]/10 px-3 py-1 text-xs font-medium text-[#4A7FB5] dark:bg-[#4A7FB5]/20 dark:text-[#6B9AC4]">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Pending
                                    </span>
                                </div>

                                {/* Avatar */}
                                <div className="mb-4 flex items-center gap-4">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${getAvatarGradient(user.id)} text-lg font-bold text-white shadow-lg`}
                                    >
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                                            {user.name}
                                        </h3>
                                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="mb-5 space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                            <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">PIN</p>
                                            <p className="font-mono font-medium text-gray-900 dark:text-white">
                                                {user.pin}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                            <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                                            <p className="font-medium capitalize text-gray-900 dark:text-white">
                                                {user.role || 'User'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Tanggal Daftar</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {user.created_at_human}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleApprove(user)}
                                        size="sm"
                                        className="flex-1 bg-gradient-to-r from-[#4A7FB5] to-[#3d6d9e] font-medium shadow-lg shadow-[#4A7FB5]/30 transition-all hover:from-[#3d6d9e] hover:to-[#2c5f8a] hover:shadow-[#4A7FB5]/40"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(user)}
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 border-red-200 text-red-600 transition-all hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Dialog - Approve */}
            <Dialog
                open={action === 'approve'}
                onOpenChange={(open) => {
                    if (!open && !isProcessing) {
                        handleCancel();
                    }
                }}
            >
                <DialogContent className="overflow-hidden border-0 p-0 sm:max-w-md">
                    <div className="bg-gradient-to-br from-[#4A7FB5] to-[#3d6d9e] p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-white">
                                    Approve User
                                </DialogTitle>
                                <p className="text-sm text-white/80">
                                    Konfirmasi persetujuan akun
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="mb-6 flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${selectedUser ? getAvatarGradient(selectedUser.id) : ''} text-lg font-bold text-white`}
                            >
                                {selectedUser ? getInitials(selectedUser.name) : ''}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {selectedUser?.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedUser?.email}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#4A7FB5]/20 bg-[#4A7FB5]/5 p-4 dark:border-[#4A7FB5]/30 dark:bg-[#4A7FB5]/10">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4A7FB5] dark:text-[#6B9AC4]" />
                                <div className="text-sm text-[#2c5f8a] dark:text-[#6B9AC4]">
                                    <p className="font-medium">User akan diaktifkan</p>
                                    <p className="mt-1 text-[#4A7FB5] dark:text-[#6B9AC4]">
                                        Setelah disetujui, user dapat login dan mengakses aplikasi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                        <Button
                            onClick={handleCancel}
                            disabled={isProcessing}
                            variant="outline"
                            className="mr-2"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="bg-gradient-to-r from-[#4A7FB5] to-[#3d6d9e] font-medium shadow-lg shadow-[#4A7FB5]/30 hover:from-[#3d6d9e] hover:to-[#2c5f8a]"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Ya, Approve
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog - Reject */}
            <Dialog
                open={action === 'reject'}
                onOpenChange={(open) => {
                    if (!open && !isProcessing) {
                        handleCancel();
                    }
                }}
            >
                <DialogContent className="overflow-hidden border-0 p-0 sm:max-w-md">
                    <div className="bg-gradient-to-br from-red-500 to-rose-500 p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <XCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-white">
                                    Tolak User
                                </DialogTitle>
                                <p className="text-sm text-white/80">
                                    Konfirmasi penolakan akun
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="mb-6 flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${selectedUser ? getAvatarGradient(selectedUser.id) : ''} text-lg font-bold text-white`}
                            >
                                {selectedUser ? getInitials(selectedUser.name) : ''}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {selectedUser?.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedUser?.email}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                                <div className="text-sm text-red-800 dark:text-red-300">
                                    <p className="font-medium">Perhatian!</p>
                                    <p className="mt-1 text-red-600 dark:text-red-400">
                                        User tidak akan dapat login dan harus mendaftar ulang.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Alasan penolakan (opsional)
                            </label>
                            <textarea
                                value={rejectNote}
                                onChange={(e) => setRejectNote(e.target.value)}
                                placeholder="Berikan alasan mengapa pendaftaran ditolak..."
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition-all focus:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-900/30"
                            />
                        </div>
                    </div>

                    <DialogFooter className="border-t bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                        <Button
                            onClick={handleCancel}
                            disabled={isProcessing}
                            variant="outline"
                            className="mr-2"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="bg-gradient-to-r from-red-500 to-rose-500 font-medium shadow-lg shadow-red-500/30 hover:from-red-600 hover:to-rose-600"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Ya, Tolak
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
