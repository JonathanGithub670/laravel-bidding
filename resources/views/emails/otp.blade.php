<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Kode Verifikasi - {{ config('app.name') }}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>

<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">

    <!-- Preheader text (hidden but shown in email preview) -->
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
        Kode verifikasi Anda: {{ $otpCode }} — Berlaku selama 1 menit. Jangan bagikan kode ini kepada siapa pun.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f0f2f5;">
        <tr>
            <td align="center" style="padding: 40px 16px;">

                <!-- Main Container -->
                <table role="presentation" width="480" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04); max-width: 480px; width: 100%;">

                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 40px 8px;">
                            <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #111827; text-align: center;">
                                Verifikasi Email Anda
                            </h1>
                            <p style="margin: 0 0 28px; font-size: 15px; color: #6b7280; text-align: center; line-height: 1.5;">
                                Kami menerima permintaan untuk memverifikasi alamat email Anda. Masukkan kode di bawah ini untuk melanjutkan.
                            </p>
                        </td>
                    </tr>

                    <!-- OTP Code Section -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;">
                                <tr>
                                    <td style="padding: 24px; text-align: center;">
                                        <p style="margin: 0 0 12px; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px;">
                                            Kode Verifikasi
                                        </p>
                                        <!-- Individual digit boxes -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                            <tr>
                                                @foreach(str_split($otpCode) as $digit)
                                                <td style="padding: 0 4px;">
                                                    <div style="width: 44px; height: 54px; background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; text-align: center; line-height: 54px; font-size: 26px; font-weight: 700; color: #111827; font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;">
                                                        {{ $digit }}
                                                    </div>
                                                </td>
                                                @endforeach
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Expiry Timer -->
                    <tr>
                        <td style="padding: 16px 40px 0; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                <tr>
                                    <td style="width: 8px; height: 8px; background-color: #f59e0b; border-radius: 50%;"></td>
                                    <td style="padding-left: 8px;">
                                        <span style="font-size: 13px; font-weight: 600; color: #d97706;">Kode berlaku selama 1 menit</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Security Notice -->
                    <tr>
                        <td style="padding: 28px 40px 0;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                <tr>
                                    <td style="padding: 14px 16px;">
                                        <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;">
                                            <strong>⚠️ Peringatan Keamanan:</strong> Jangan pernah membagikan kode ini kepada siapa pun. Tim {{ config('app.name') }} tidak akan pernah meminta kode verifikasi Anda.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 28px 40px 0;">
                            <hr style="border: none; border-top: 1px solid #f0f2f5; margin: 0;">
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px 28px;">
                            <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.6;">
                                Anda menerima email ini karena ada permintaan verifikasi untuk akun yang terkait dengan alamat email ini.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.6;">
                                Jika Anda tidak membuat permintaan ini, abaikan email ini.
                            </p>
                        </td>
                    </tr>

                </table>

                <!-- Copyright Footer -->
                <table role="presentation" width="480" cellspacing="0" cellpadding="0" border="0" style="max-width: 480px; width: 100%;">
                    <tr>
                        <td style="padding: 24px 40px 0; text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #b0b7c3;">
                                &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>

</html>