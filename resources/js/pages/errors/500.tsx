import ErrorPage from '@/components/error-page';

export default function ServerError() {
    return (
        <ErrorPage
            code={500}
            title="Terjadi Kesalahan Server"
            message="Maaf, terjadi kesalahan pada server kami. Tim teknis telah diberitahu. Silakan coba lagi dalam beberapa saat."
            actions={[
                { label: '↻ Coba Lagi', href: '#reload', primary: true },
                { label: '← Kembali ke Beranda', href: '/' },
            ]}
        />
    );
}
