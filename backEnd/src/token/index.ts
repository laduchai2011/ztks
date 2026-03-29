import dotenv from 'dotenv';
import jwt, { Secret, SignOptions, JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET';

// Ép kiểu để chắc chắn JWT_SECRET là Secret
// const JWT_SECRET = (process.env.JWT_SECRET ?? 'your-secret-key') as Secret;

export interface MyJwtPayload {
    id: number;
    role?: string;
}

type CleanPayload = Omit<MyJwtPayload & Partial<JwtPayload>, 'exp' | 'iat' | 'nbf'>;

type TokenState = MyJwtPayload | 'expired' | 'invalid';

export function isJwtPayload(obj: TokenState): obj is MyJwtPayload {
    return typeof obj === 'object' && obj !== null && 'id' in obj;
}

// const signOptions: SignOptions = {
//     expiresIn: '1000h',
// };

// Tạo token
// export function generateToken(payload: MyJwtPayload, signOptions: SignOptions): string {
//     const cp_signOptions = {...signOptions}
//     cp_signOptions.algorithm = 'RS256'
//     return jwt.sign(payload as object, JWT_SECRET as Secret, cp_signOptions);
// }
export function generateAccessToken(payload: MyJwtPayload, signOptions: SignOptions): string {
    const cp_signOptions = { ...signOptions };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, iat, nbf, ...cleanPayload }: CleanPayload = payload as CleanPayload;
    cp_signOptions.algorithm = 'HS256';
    return jwt.sign(cleanPayload as object, ACCESS_TOKEN_SECRET as Secret, cp_signOptions);
}
export function generateRefreshToken(payload: MyJwtPayload, signOptions: SignOptions): string {
    const cp_signOptions = { ...signOptions };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, iat, nbf, ...cleanPayload }: CleanPayload = payload as CleanPayload;
    cp_signOptions.algorithm = 'HS256';
    return jwt.sign(cleanPayload as object, REFRESH_TOKEN_SECRET as Secret, cp_signOptions);
}

// Xác minh token
// export function verifyToken(token: string): MyJwtPayload | null {
//     try {
//         return jwt.verify(token, JWT_SECRET) as MyJwtPayload;
//     } catch (error) {
//         console.error('Token verification failed:', error);
//         return null;
//     }
// }
// const timeExpireat = 60 * 60 * 24 * 30 * 12; // 1 year
export function verifyAccessToken(token: string): TokenState {
    try {
        const result = jwt.verify(token, ACCESS_TOKEN_SECRET as Secret) as MyJwtPayload;
        // console.log(111111, result);
        return result;
    } catch (error: any) {
        // console.error(11111, 'error', new TokenExpiredError('TokenExpiredError', error), error, error instanceof TokenExpiredError)
        if (error instanceof TokenExpiredError) {
            return 'expired';
        }
        if (error instanceof JsonWebTokenError) {
            return 'invalid';
        }
        return 'invalid';
    }
}
export function verifyRefreshToken(token: string): TokenState {
    try {
        const result = jwt.verify(token, REFRESH_TOKEN_SECRET as Secret) as MyJwtPayload;
        // console.log(222222, result);
        return result;
    } catch (error: any) {
        // console.error(22222, 'error', new TokenExpiredError('TokenExpiredError', error), error, error instanceof TokenExpiredError)
        if (error instanceof TokenExpiredError) {
            return 'expired';
        }
        if (error instanceof JsonWebTokenError) {
            return 'invalid';
        }
        return 'invalid';
    }
}
