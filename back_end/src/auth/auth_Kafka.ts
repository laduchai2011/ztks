import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export default function auth_Kafka(req: Request, res: Response, next: NextFunction) {
    try {
        const timestamp = req.headers['x-api-timestamp'];
        const signature = req.headers['x-api-signature'];

        const secret = process.env.KEY_JAVA_KAFKA_REQUEST;

        // 1. Kiểm tra cấu hình và header
        if (typeof timestamp !== 'string' || typeof signature !== 'string' || !secret || secret.trim().length === 0) {
            console.error('[AUTH_KAFKA] Missing authentication data:', {
                timestampExists: typeof timestamp === 'string',
                signatureExists: typeof signature === 'string',
                secretExists: !!secret,
            });

            res.status(401).json({
                message: 'Unauthorized',
            });
            return;
        }

        // 2. Kiểm tra timestamp
        const requestTime = Number(timestamp);

        if (
            !/^\d+$/.test(timestamp) ||
            !Number.isSafeInteger(requestTime) ||
            Math.abs(Date.now() - requestTime) > 5 * 60 * 1000
        ) {
            console.error('[AUTH_KAFKA] Invalid or expired timestamp:', {
                timestamp,
                serverTime: Date.now(),
            });

            res.status(401).json({
                message: 'Request expired',
            });
            return;
        }

        // 3. Kiểm tra định dạng chữ ký SHA256 hex (64 ký tự)
        if (!/^[a-fA-F0-9]{64}$/.test(signature)) {
            console.error('[AUTH_KAFKA] Invalid signature format:', {
                signatureLength: signature.length,
            });

            res.status(401).json({
                message: 'Invalid signature format',
            });
            return;
        }

        // 4. Tạo chữ ký dự kiến từ timestamp
        const expectedSignature = crypto.createHmac('sha256', secret).update(timestamp, 'utf8').digest('hex');

        const actual = Buffer.from(signature, 'hex');
        const expected = Buffer.from(expectedSignature, 'hex');

        // 5. Log debug (không log secret)
        // console.log('[AUTH_KAFKA] DEBUG:', {
        //     secretExists: !!secret,
        //     secretLength: secret.length,
        //     timestamp,
        //     receivedSignature: signature,
        //     expectedSignature,
        // });

        // 6. So sánh chữ ký
        if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
            console.error('[AUTH_KAFKA] Invalid signature:', {
                timestamp,
                receivedSignature: signature,
                expectedSignature,
            });

            res.status(401).json({
                message: 'Invalid signature',
            });
            return;
        }

        // 7. Xác thực thành công
        next();
    } catch (error) {
        console.error('[AUTH_KAFKA] Authentication error:', error);

        res.status(500).json({
            message: 'Authentication internal error',
        });
        return;
    }
}
