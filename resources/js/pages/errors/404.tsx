import ErrorPage from '@/components/error-page';

export default function NotFound() {
    return (
        <ErrorPage
            code={404}
            title="Halaman Tidak Ditemukan"
            message="Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Periksa kembali URL atau kembali ke halaman utama."
            actions={[
                { label: '← Kembali ke Beranda', href: '/', primary: true },
                { label: 'Lihat Lelang', href: '/auctions' },
            ]}
        />
    );
}
