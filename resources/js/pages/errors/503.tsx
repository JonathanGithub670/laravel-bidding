import ErrorPage from '@/components/error-page';

export default function ServiceUnavailable() {
    return (
        <ErrorPage
            code={503}
            title="Sedang Dalam Pemeliharaan"
            message="Sistem sedang dalam pemeliharaan untuk peningkatan layanan. Silakan kembali lagi dalam beberapa menit."
            actions={[
                { label: '↻ Coba Lagi', href: '#reload', primary: true },
            ]}
        />
    );
}
