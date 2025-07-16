import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/verify?token=${token}`;

    try {
        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: "E-Posta Adresinizi Doğrulayın",
        html: `
            <!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Onayı</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f7f4;
            color: #1c2d45;
            line-height: 1.6;
            padding: 20px;
        }

        .email-container {
            max-width: 500px;
            margin: 0 auto;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(28, 45, 69, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #1c2d45 0%, #2a3f5f 100%);
            color: #f9f7f4;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23f9f7f4" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
        }

        .header-content {
            position: relative;
            z-index: 1;
        }

        .logo {
            display: inline-block;
            width: 60px;
            height: 60px;
            color: #f9f7f4;
        }

        .logo {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .content {
            padding: 40px 30px;
            background-color: white;
            text-align: center;
        }

        .welcome-message {
            margin-bottom: 30px;
        }

        .welcome-message h2 {
            color: #1c2d45;
            font-size: 24px;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .welcome-message p {
            color: #666;
            font-size: 16px;
            margin-bottom: 15px;
        }

        .confirm-button {
            display: inline-block;
            background: linear-gradient(135deg, #1c2d45 0%, #2a3f5f 100%);
            color: #f9f7f4 !important;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(28, 45, 69, 0.3);
        }

        .confirm-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(28, 45, 69, 0.4);
        }

        .footer {
            background-color: #1c2d45;
            color: #f9f7f4;
            padding: 25px;
            text-align: center;
        }

        .footer p {
            margin-bottom: 5px;
            opacity: 0.9;
            font-size: 14px;
        }

        .footer a {
            color: #f9f7f4;
            text-decoration: underline;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .welcome-message h2 {
                font-size: 20px;
            }
            
            .confirm-button {
                padding: 12px 30px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="logo">
                    <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="60"
                        height="60"
                        viewBox="128 128 768 768"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <g
                            transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
                            fill="#f9f7f4"
                            stroke="none"
                        >
                            <path
                                d="M5036 8720 c-244 -91 -573 -280 -820 -472 -157 -122 -211 -171 -381
-342 -338 -340 -536 -634 -688 -1021 -71 -182 -98 -267 -208 -662 -50 -180
-125 -436 -165 -568 -91 -294 -431 -1313 -509 -1525 -71 -195 -76 -232 -42
-302 41 -84 224 -276 462 -487 526 -464 1009 -811 1630 -1171 214 -124 554
-298 693 -355 l113 -46 92 37 c186 74 567 273 877 457 485 289 1080 724 1445
1058 39 35 110 100 159 144 122 110 292 300 321 359 40 80 38 92 -75 406 -76
213 -365 1083 -463 1395 -47 149 -128 423 -181 610 -179 638 -276 876 -479
1180 -151 225 -382 484 -607 679 -58 50 -107 93 -110 96 -3 4 -51 41 -107 83
-232 175 -508 334 -740 426 -137 54 -129 53 -217 21z m-927 -2186 c39 -19 191
-115 338 -213 148 -97 320 -208 383 -246 255 -151 279 -155 451 -67 137 70
290 164 544 332 241 161 345 221 393 227 61 8 131 -34 242 -146 176 -177 301
-395 404 -706 44 -132 108 -368 120 -445 3 -19 14 -80 25 -135 11 -55 22 -125
26 -155 3 -30 10 -84 15 -120 12 -84 14 -253 5 -305 -11 -56 -47 -124 -87
-161 -40 -38 -112 -86 -277 -185 -134 -80 -248 -177 -285 -243 -27 -46 -35
-72 -101 -330 -69 -267 -92 -342 -125 -405 -106 -198 -489 -582 -807 -809
-151 -108 -211 -142 -254 -142 -81 0 -443 274 -712 539 -246 242 -345 372
-388 513 -11 35 -46 167 -79 293 -76 292 -74 289 -104 338 -52 88 -158 172
-390 308 -210 123 -264 196 -273 370 -3 53 -1 132 5 175 6 43 14 104 17 134
10 87 62 348 94 477 123 483 256 750 490 983 115 114 181 160 232 160 15 0 58
-16 98 -36z"
                            />
                            <path
                                d="M3701 5754 c-41 -52 -65 -151 -65 -264 2 -180 50 -307 154 -403 113
-105 262 -153 444 -144 201 9 349 78 489 227 69 73 88 110 67 135 -15 18 -24
22 -456 214 -199 88 -406 180 -460 204 -134 61 -148 63 -173 31z"
                            />
                            <path
                                d="M6365 5726 c-657 -292 -893 -400 -909 -416 -32 -31 -13 -67 88 -166
145 -144 289 -204 491 -204 118 0 209 21 295 66 178 93 270 257 270 479 -1
155 -48 295 -99 295 -9 0 -70 -24 -136 -54z"
                            />
                            <path
                                d="M5050 4983 c-49 -57 -237 -429 -275 -547 -43 -134 -28 -192 41 -166
34 13 129 81 209 150 94 80 90 81 253 -52 39 -32 92 -69 118 -83 42 -22 50
-24 68 -11 28 18 26 81 -5 173 -39 118 -224 475 -275 532 -59 66 -79 66 -134
4z"
                            />
                        </g>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="welcome-message">
                <h2>Email Onayı</h2>
                <p>Hesabınızı aktifleştirmek için email adresinizi onaylamanız gerekiyor.</p>
                <p>Aşağıdaki butona tıklayarak onaylayabilirsiniz.</p>
            </div>

            <a href="${verificationUrl}" class="confirm-button">Email Adresimi Onayla</a>

            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                Bu bağlantı 24 saat sonra geçerliliğini yitirecektir.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Taskmaster</strong></p>
        </div>
    </div>
</body>
</html>
        `
        });
    } catch (error) {
        console.error("Email gönderilirken hata oluştu:", error);
        throw new Error("Email gönderilirken bir hata oluştu.");
    }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/reset-password?token=${token}`;

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Şifre Sıfırlama Talebi",
            html: `
            <!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Onayı</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f7f4;
            color: #1c2d45;
            line-height: 1.6;
            padding: 20px;
        }

        .email-container {
            max-width: 500px;
            margin: 0 auto;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(28, 45, 69, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #1c2d45 0%, #2a3f5f 100%);
            color: #f9f7f4;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }


        .header-content {
            position: relative;
            z-index: 1;
        }

        .logo {
            display: inline-block;
            width: 60px;
            height: 60px;
            color: #f9f7f4;
        }

        .logo {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .content {
            padding: 40px 30px;
            background-color: white;
            text-align: center;
        }

        .welcome-message {
            margin-bottom: 30px;
        }

        .welcome-message h2 {
            color: #1c2d45;
            font-size: 24px;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .welcome-message p {
            color: #666;
            font-size: 16px;
            margin-bottom: 15px;
        }

        .confirm-button {
            display: inline-block;
            background: linear-gradient(135deg, #1c2d45 0%, #2a3f5f 100%);
            color: #f9f7f4 !important;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(28, 45, 69, 0.3);
        }

        .confirm-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(28, 45, 69, 0.4);
        }

        .footer {
            background-color: #1c2d45;
            color: #f9f7f4;
            padding: 25px;
            text-align: center;
        }

        .footer p {
            margin-bottom: 5px;
            opacity: 0.9;
            font-size: 14px;
        }

        .footer a {
            color: #f9f7f4;
            text-decoration: underline;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .welcome-message h2 {
                font-size: 20px;
            }
            
            .confirm-button {
                padding: 12px 30px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="logo">
                    <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="60"
                        height="60"
                        viewBox="128 128 768 768"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <g
                            transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
                            fill="#f9f7f4"
                            stroke="none"
                        >
                            <path
                                d="M5036 8720 c-244 -91 -573 -280 -820 -472 -157 -122 -211 -171 -381
-342 -338 -340 -536 -634 -688 -1021 -71 -182 -98 -267 -208 -662 -50 -180
-125 -436 -165 -568 -91 -294 -431 -1313 -509 -1525 -71 -195 -76 -232 -42
-302 41 -84 224 -276 462 -487 526 -464 1009 -811 1630 -1171 214 -124 554
-298 693 -355 l113 -46 92 37 c186 74 567 273 877 457 485 289 1080 724 1445
1058 39 35 110 100 159 144 122 110 292 300 321 359 40 80 38 92 -75 406 -76
213 -365 1083 -463 1395 -47 149 -128 423 -181 610 -179 638 -276 876 -479
1180 -151 225 -382 484 -607 679 -58 50 -107 93 -110 96 -3 4 -51 41 -107 83
-232 175 -508 334 -740 426 -137 54 -129 53 -217 21z m-927 -2186 c39 -19 191
-115 338 -213 148 -97 320 -208 383 -246 255 -151 279 -155 451 -67 137 70
290 164 544 332 241 161 345 221 393 227 61 8 131 -34 242 -146 176 -177 301
-395 404 -706 44 -132 108 -368 120 -445 3 -19 14 -80 25 -135 11 -55 22 -125
26 -155 3 -30 10 -84 15 -120 12 -84 14 -253 5 -305 -11 -56 -47 -124 -87
-161 -40 -38 -112 -86 -277 -185 -134 -80 -248 -177 -285 -243 -27 -46 -35
-72 -101 -330 -69 -267 -92 -342 -125 -405 -106 -198 -489 -582 -807 -809
-151 -108 -211 -142 -254 -142 -81 0 -443 274 -712 539 -246 242 -345 372
-388 513 -11 35 -46 167 -79 293 -76 292 -74 289 -104 338 -52 88 -158 172
-390 308 -210 123 -264 196 -273 370 -3 53 -1 132 5 175 6 43 14 104 17 134
10 87 62 348 94 477 123 483 256 750 490 983 115 114 181 160 232 160 15 0 58
-16 98 -36z"
                            />
                            <path
                                d="M3701 5754 c-41 -52 -65 -151 -65 -264 2 -180 50 -307 154 -403 113
-105 262 -153 444 -144 201 9 349 78 489 227 69 73 88 110 67 135 -15 18 -24
22 -456 214 -199 88 -406 180 -460 204 -134 61 -148 63 -173 31z"
                            />
                            <path
                                d="M6365 5726 c-657 -292 -893 -400 -909 -416 -32 -31 -13 -67 88 -166
145 -144 289 -204 491 -204 118 0 209 21 295 66 178 93 270 257 270 479 -1
155 -48 295 -99 295 -9 0 -70 -24 -136 -54z"
                            />
                            <path
                                d="M5050 4983 c-49 -57 -237 -429 -275 -547 -43 -134 -28 -192 41 -166
34 13 129 81 209 150 94 80 90 81 253 -52 39 -32 92 -69 118 -83 42 -22 50
-24 68 -11 28 18 26 81 -5 173 -39 118 -224 475 -275 532 -59 66 -79 66 -134
4z"
                            />
                        </g>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="welcome-message">
                <h2>
Şifre Sıfırlama Talebi
</h2>
                <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın.</p>
            </div>

            <a href="${resetUrl}" class="confirm-button">
                Şifremi Sıfırla
</a>

            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                Bu bağlantı 24 saat sonra geçerliliğini yitirecektir.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Taskmaster</strong></p>
        </div>
    </div>
</body>
</html>
        `
        });
    } catch (error) {
        console.error("Email gönderilirken hata oluştu:", error);
        throw new Error("Email gönderilirken bir hata oluştu.");
    }
}