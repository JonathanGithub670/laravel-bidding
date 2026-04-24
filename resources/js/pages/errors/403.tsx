import ErrorPage from '@/components/error-page';

export default function Forbidden() {
    return (
        <ErrorPage
            code={403}
            title="Akses Ditolak"
            message="Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator jika Anda merasa ini adalah kesalahan."
            actions={[
                { label: '← Kembali ke Beranda', href: '/', primary: true },
                { label: 'Dashboard', href: '/dashboard' },
            ]}
        />
    );
}
