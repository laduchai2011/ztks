// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import admin from './conf';

export const authOtpFirebaseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        res.status(401).send('No token');
        return;
    }

    try {
        const decoded = await admin.auth().verifyIdToken(token);

        (req as any).user = decoded;

        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(401).send('Invalid token');
        return;
    }
};
