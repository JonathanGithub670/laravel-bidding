import ErrorPage from '@/components/error-page';

export default function SessionExpired() {
    return (
        <ErrorPage
            code={419}
            title="Sesi Telah Berakhir"
            message="Sesi login Anda telah kedaluwarsa. Silakan muat ulang halaman atau login kembali untuk melanjutkan."
            actions={[
                { label: '🔑 Login Kembali', href: '/login', primary: true },
                { label: '↻ Muat Ulang', href: '#reload' },
            ]}
        />
    );
}
