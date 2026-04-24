<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Frontend Server Offline - {{ config('app.name') }}</title>
    <style>
        *,
        *::before,
        *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0f0f14;
            color: #e4e4e7;
            overflow: hidden;
        }

        .bg-grid {
            position: fixed;
            inset: 0;
            background-image:
                linear-gradient(rgba(239, 68, 68, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(239, 68, 68, 0.03) 1px, transparent 1px);
            background-size: 60px 60px;
        }

        .bg-glow {
            position: fixed;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            filter: blur(120px);
            opacity: 0.12;
        }

        .glow-1 {
            background: #ef4444;
            top: -200px;
            left: -100px;
        }

        .glow-2 {
            background: #f97316;
            bottom: -200px;
            right: -100px;
        }

        .container {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 2rem;
            max-width: 560px;
        }

        .icon-pulse {
            width: 80px;
            height: 80px;
            margin: 0 auto 2rem;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s ease-in-out infinite;
        }

        .icon-pulse svg {
            width: 36px;
            height: 36px;
            color: #ef4444;
        }

        @keyframes pulse {

            0%,
            100% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2);
            }

            50% {
                box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
            }
        }

        .title {
            font-size: 1.75rem;
            font-weight: 800;
            color: #f4f4f5;
            margin-bottom: 0.75rem;
        }

        .subtitle {
            font-size: 1rem;
            color: #ef4444;
            font-weight: 600;
            margin-bottom: 1.5rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        .message {
            font-size: 1rem;
            color: #a1a1aa;
            line-height: 1.7;
            margin-bottom: 2rem;
        }

        .terminal {
            background: #1a1a24;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 2rem;
            text-align: left;
        }

        .terminal-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 1rem;
        }

        .terminal-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }

        .dot-red {
            background: #ef4444;
        }

        .dot-yellow {
            background: #eab308;
        }

        .dot-green {
            background: #22c55e;
        }

        .terminal-code {
            font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
            font-size: 0.875rem;
            color: #a78bfa;
        }

        .terminal-code .prompt {
            color: #22c55e;
        }

        .terminal-code .cmd {
            color: #e4e4e7;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.75rem;
            border-radius: 0.75rem;
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            color: #d4d4d8;
            transition: all 0.2s;
        }

        .btn:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .status-bar {
            margin-top: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.8rem;
            color: #71717a;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ef4444;
            animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.3;
            }
        }
    </style>
</head>

<body>
    <div class="bg-grid"></div>
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>

    <div class="container">
        <div class="icon-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
        </div>

        <p class="subtitle">⚠ Frontend Offline</p>
        <h1 class="title">Vite Dev Server Tidak Aktif</h1>
        <p class="message">
            Aplikasi tidak dapat berjalan karena server frontend (Vite) belum dijalankan.
            Jalankan perintah berikut di terminal untuk memulai:
        </p>

        <div class="terminal">
            <div class="terminal-header">
                <div class="terminal-dot dot-red"></div>
                <div class="terminal-dot dot-yellow"></div>
                <div class="terminal-dot dot-green"></div>
            </div>
            <div class="terminal-code">
                <span class="prompt">$</span> <span class="cmd">npm run dev</span>
            </div>
        </div>

        <button class="btn" onclick="window.location.reload()">
            ↻ Muat Ulang Halaman
        </button>

        <div class="status-bar">
            <div class="status-dot"></div>
            <span>Vite Dev Server: Disconnected</span>
        </div>
    </div>

    <script>
        // Auto-reload setiap 5 detik untuk cek apakah Vite sudah aktif
        setInterval(() => {
            fetch(window.location.href, { method: 'HEAD' })
                .then(r => {
                    if (r.ok) window.location.reload();
                })
                .catch(() => { });
        }, 5000);
    </script>
</body>

</html>