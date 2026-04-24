import ErrorPage from '@/components/error-page';

export default function Unauthorized() {
    return (
        <ErrorPage
            code={401}
            title="Tidak Terautentikasi"
            message="Anda perlu login terlebih dahulu untuk mengakses halaman ini."
            actions={[
                { label: '🔑 Login', href: '/login', primary: true },
                { label: '← Kembali ke Beranda', href: '/' },
            ]}
        />
    );
}
