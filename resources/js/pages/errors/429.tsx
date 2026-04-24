import ErrorPage from '@/components/error-page';

export default function TooManyRequests() {
    return (
        <ErrorPage
            code={429}
            title="Terlalu Banyak Permintaan"
            message="Anda telah mengirim terlalu banyak permintaan. Silakan tunggu sebentar sebelum mencoba lagi."
            actions={[
                { label: '↻ Coba Lagi', href: '#reload', primary: true },
                { label: '← Kembali ke Beranda', href: '/' },
            ]}
        />
    );
}
