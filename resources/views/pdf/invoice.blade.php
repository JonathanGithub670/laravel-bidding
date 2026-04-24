<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $doc['reference'] }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            color: #374151;
            line-height: 1.5;
            background: #fff;
        }

        .invoice-card {
            max-width: 700px;
            margin: 0 auto;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
        }

        .top-border {
            height: 5px;
            background: #4A7FB5;
        }

        /* Header */
        .header {
            padding: 20px 24px;
            border-bottom: 1px solid #f3f4f6;
            background: #fafbfc;
        }
        .header-row {
            display: table;
            width: 100%;
        }
        .header-left {
            display: table-cell;
            vertical-align: middle;
            width: 50%;
        }
        .header-right {
            display: table-cell;
            vertical-align: middle;
            width: 50%;
            text-align: right;
        }
        .logo-img {
            height: 120px;
            width: auto;
        }
        .tagline {
            font-size: 9px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-weight: 500;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 600;
            margin-top: 6px;
        }
        .status-yellow { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .status-green { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .status-red { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .status-blue { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .status-indigo { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
        .status-gray { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }

        /* Meta row */
        .meta-row {
            display: table;
            width: 100%;
            padding: 10px 24px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 11px;
            color: #6b7280;
        }
        .meta-left {
            display: table-cell;
            vertical-align: middle;
            text-align: left;
        }
        .meta-right {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
        }
        .meta-label {
            font-family: monospace;
            font-weight: 600;
            color: #6b7280;
        }

        /* Subject */
        .subject {
            padding: 12px 24px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 16px;
            font-weight: 700;
            color: #111827;
        }

        /* Body */
        .body {
            padding: 24px;
        }
        .greeting {
            margin-bottom: 16px;
            font-size: 13px;
        }

        /* Invoice table */
        .invoice-table {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            margin: 16px 0;
            border-collapse: collapse;
        }
        .table-header {
            padding: 10px 16px;
            font-size: 12px;
            font-weight: 600;
        }
        .table-header-invoice {
            background: #ede9fe;
            color: #5b21b6;
        }
        .table-header-reimburse {
            background: #d1fae5;
            color: #065f46;
        }

        .section-label {
            padding: 8px 16px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }

        .info-grid {
            display: table;
            width: 100%;
            padding: 4px 16px 12px;
        }
        .info-cell {
            display: table-cell;
            width: 50%;
            padding: 4px 0;
        }
        .info-label {
            font-size: 11px;
            color: #9ca3af;
        }
        .info-value {
            font-size: 12px;
            font-weight: 600;
            color: #111827;
        }

        .fee-row {
            display: table;
            width: 100%;
            padding: 6px 16px;
            border-top: 1px solid #f9fafb;
        }
        .fee-name {
            display: table-cell;
            vertical-align: middle;
            font-size: 12px;
            color: #4b5563;
        }
        .fee-name-note {
            font-size: 10px;
            color: #9ca3af;
            margin-left: 4px;
        }
        .fee-value {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            font-size: 12px;
            font-weight: 600;
            color: #111827;
        }
        .fee-value-free {
            color: #059669;
        }

        .total-row {
            display: table;
            width: 100%;
            padding: 12px 16px;
            border-top: 1px solid #e5e7eb;
        }
        .total-row-invoice { background: #ede9fe; }
        .total-row-reimburse { background: #d1fae5; }
        .total-label {
            display: table-cell;
            font-size: 14px;
            font-weight: 700;
            color: #111827;
        }
        .total-value {
            display: table-cell;
            text-align: right;
            font-size: 16px;
            font-weight: 700;
        }
        .total-value-invoice { color: #7c3aed; }
        .total-value-reimburse { color: #059669; }

        .total-note {
            padding: 4px 16px 8px;
            font-size: 10px;
            color: #6b7280;
        }

        /* Date cards */
        .date-grid {
            display: table;
            width: 100%;
            margin: 16px 0;
        }
        .date-card {
            display: table-cell;
            width: 50%;
            padding: 10px;
        }
        .date-card-inner {
            background: #f9fafb;
            border-radius: 8px;
            padding: 12px;
        }
        .date-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6b7280;
        }
        .date-value {
            font-size: 12px;
            font-weight: 600;
            color: #111827;
            margin-top: 2px;
        }

        /* Footer */
        .footer-msg {
            border-top: 1px solid #f3f4f6;
            padding: 16px 0;
            font-size: 12px;
            color: #6b7280;
        }

        .signature-box {
            background: #f9fafb;
            border-radius: 8px;
            padding: 12px 16px;
            margin-top: 16px;
        }
        .signature-row {
            display: table;
            width: 100%;
        }
        .signature-logo {
            display: table-cell;
            vertical-align: middle;
            width: 80px;
        }
        .signature-logo img {
            height: 64px;
            width: 64px;
        }
        .signature-text {
            display: table-cell;
            vertical-align: middle;
            padding-left: 10px;
        }
        .signature-name {
            font-size: 12px;
            font-weight: 700;
            color: #111827;
        }
        .signature-tagline {
            font-size: 10px;
            color: #6b7280;
        }
        .signature-date {
            font-size: 10px;
            color: #9ca3af;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="invoice-card">
        <div class="top-border"></div>

        <!-- Header: Logo left, tagline right -->
        <div class="header">
            <div class="header-row">
                <div class="header-left">
                    <img src="{{ $logoBase64 }}" alt="nathBid" class="logo-img">
                </div>
                <div class="header-right">
                    <div class="tagline">Platform Lelang Online Terpercaya</div>
                    <div>
                        <span class="status-badge status-{{ $doc['status_color'] }}">
                            {{ $doc['status_label'] }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Meta: Reference left, Date right -->
        <div class="meta-row">
            <div class="meta-left">
                <span class="meta-label"># {{ $doc['reference'] }}</span>
            </div>
            <div class="meta-right">
                {{ \Carbon\Carbon::parse($doc['created_at'])->locale('id')->translatedFormat('d F Y \\p\\u\\k\\u\\l H.i') }}
            </div>
        </div>

        <!-- Subject -->
        <div class="subject">
            @if($doc['type'] === 'reimbursement')
                Pengembalian Dana Lelang: {{ $doc['auction_title'] }}
            @else
                Selamat! Anda Memenangkan Lelang: {{ $doc['auction_title'] }}
            @endif
        </div>

        <!-- Body -->
        <div class="body">
            <div class="greeting">
                <p>Kepada Yth. <strong>{{ $doc['winner_name'] }}</strong>,</p>
                <br>
                @if($doc['type'] === 'reimbursement')
                    <p>Kami informasikan bahwa dana pendaftaran Anda untuk lelang <strong>"{{ $doc['auction_title'] }}"</strong> telah dikembalikan ke saldo akun Anda. Berikut rincian pengembalian dana:</p>
                @else
                    <p>Selamat! Anda telah memenangkan lelang <strong>"{{ $doc['auction_title'] }}"</strong>@if($doc['seller_name']) yang diselenggarakan oleh {{ $doc['seller_name'] }}@endif. Saldo Anda akan dipotong sesuai dengan rincian tagihan berikut:</p>
                @endif
            </div>

            <!-- Invoice Table -->
            <table class="invoice-table" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="table-header {{ $doc['type'] === 'reimbursement' ? 'table-header-reimburse' : 'table-header-invoice' }}" colspan="2">
                        {{ $doc['type'] === 'reimbursement' ? 'Rincian Pengembalian' : 'Rincian Tagihan' }}
                    </td>
                </tr>

                <!-- Auction Info -->
                <tr><td class="section-label" colspan="2">Informasi Lelang</td></tr>
                <tr>
                    <td colspan="2">
                        <div class="info-grid">
                            <div class="info-cell">
                                <div class="info-label">Nama Lelang</div>
                                <div class="info-value">{{ $doc['auction_title'] }}</div>
                            </div>
                            @if($doc['auction_category'])
                            <div class="info-cell">
                                <div class="info-label">Kategori</div>
                                <div class="info-value">{{ $doc['auction_category'] }}</div>
                            </div>
                            @endif
                        </div>
                        <div class="info-grid">
                            @if($doc['seller_name'])
                            <div class="info-cell">
                                <div class="info-label">Penjual</div>
                                <div class="info-value">{{ $doc['seller_name'] }}</div>
                            </div>
                            @endif
                            <div class="info-cell">
                                <div class="info-label">Pemenang</div>
                                <div class="info-value">{{ $doc['winner_name'] }}</div>
                            </div>
                        </div>
                    </td>
                </tr>

                <!-- Fee Breakdown -->
                <tr><td class="section-label" colspan="2">{{ $doc['type'] === 'reimbursement' ? 'Rincian Pengembalian' : 'Rincian Biaya' }}</td></tr>

                @if($doc['type'] !== 'reimbursement')
                <tr>
                    <td colspan="2">
                        <div class="fee-row">
                            <span class="fee-name">- Biaya Pendaftaran <span class="fee-name-note">(sudah dipotong saat daftar)</span></span>
                            <span class="fee-value">{{ $doc['formatted_registration_fee'] ?? 'Rp 0' }}</span>
                        </div>
                    </td>
                </tr>
                @endif

                <tr>
                    <td colspan="2">
                        <div class="fee-row">
                            <span class="fee-name">- {{ $doc['type'] === 'reimbursement' ? 'Biaya Pendaftaran' : 'Bid Pemenang' }}</span>
                            <span class="fee-value">{{ $doc['formatted_amount'] }}</span>
                        </div>
                    </td>
                </tr>

                @if($doc['type'] !== 'reimbursement')
                <tr>
                    <td colspan="2">
                        <div class="fee-row">
                            <span class="fee-name">- Biaya Admin</span>
                            <span class="fee-value fee-value-free">Gratis</span>
                        </div>
                    </td>
                </tr>
                @endif

                @if($doc['type'] !== 'reimbursement' && ($doc['app_fee'] ?? 0) > 0)
                <tr>
                    <td colspan="2">
                        <div class="fee-row">
                            <span class="fee-name">- Biaya Aplikasi</span>
                            <span class="fee-value">{{ $doc['formatted_app_fee'] }}</span>
                        </div>
                    </td>
                </tr>
                @endif

                <!-- Total -->
                <tr>
                    <td colspan="2">
                        <div class="total-row {{ $doc['type'] === 'reimbursement' ? 'total-row-reimburse' : 'total-row-invoice' }}">
                            <span class="total-label">{{ $doc['type'] === 'reimbursement' ? 'Total Pengembalian' : 'Total Potongan Saldo' }}</span>
                            <span class="total-value {{ $doc['type'] === 'reimbursement' ? 'total-value-reimburse' : 'total-value-invoice' }}">
                                {{ $doc['type'] === 'reimbursement' ? '+' : '' }}{{ $doc['formatted_total'] }}
                            </span>
                        </div>
                    </td>
                </tr>

                @if($doc['type'] !== 'reimbursement' && ($doc['registration_fee'] ?? 0) > 0)
                <tr>
                    <td colspan="2" class="total-note">
                        * Biaya pendaftaran ({{ $doc['formatted_registration_fee'] }}) sudah dipotong dari saldo pada saat pendaftaran lelang
                    </td>
                </tr>
                @endif
            </table>

            <!-- Dates -->
            <div class="date-grid">
                <div class="date-card">
                    <div class="date-card-inner">
                        <div class="date-label">Tanggal Dibuat</div>
                        <div class="date-value">{{ \Carbon\Carbon::parse($doc['created_at'])->locale('id')->translatedFormat('l, d F Y') }}</div>
                    </div>
                </div>
                @if($doc['due_at'] || $doc['paid_at'])
                <div class="date-card">
                    <div class="date-card-inner">
                        <div class="date-label">{{ $doc['paid_at'] ? 'Tanggal Selesai' : 'Jatuh Tempo' }}</div>
                        <div class="date-value">{{ \Carbon\Carbon::parse($doc['paid_at'] ?? $doc['due_at'])->locale('id')->translatedFormat('l, d F Y') }}</div>
                    </div>
                </div>
                @endif
            </div>

            <!-- Footer message -->
            <div class="footer-msg">
                @if($doc['type'] === 'reimbursement')
                    <p>Dana telah dikembalikan ke saldo akun Anda secara otomatis. Silakan cek saldo Anda di halaman profil.</p>
                @else
                    <p>Saldo Anda telah otomatis dipotong sesuai rincian tagihan di atas. Jika ada pertanyaan, jangan ragu untuk menghubungi tim kami.</p>
                @endif
                <p style="color: #9ca3af; margin-top: 8px;">Terima kasih telah menggunakan <strong style="color: #4b5563;">nathBid</strong>.</p>
            </div>

            <!-- Signature -->
            <div class="signature-box">
                <div class="signature-row">
                    <div class="signature-logo">
                        <img src="{{ $logoBase64 }}" alt="nathBid">
                    </div>
                    <div class="signature-text">
                        <div class="signature-name">nathBid</div>
                        <div class="signature-tagline">Platform Lelang Online Terpercaya</div>
                    </div>
                </div>
                <div class="signature-date">
                    Dokumen ini diterbitkan secara otomatis oleh sistem pada {{ \Carbon\Carbon::parse($doc['created_at'])->locale('id')->translatedFormat('l, d F Y') }}.
                </div>
            </div>
        </div>
    </div>
</body>
</html>
