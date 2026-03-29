import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth_firebase } from '@src/otp/firebasesms';

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
    }
}

const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth_firebase, 'recaptcha-container', {
            size: 'invisible',
        });
    }

    return window.recaptchaVerifier;
};

export const sendOtp = async (phone: string) => {
    const appVerifier = setupRecaptcha();

    await appVerifier.verify();

    const confirmationResult = await signInWithPhoneNumber(auth_firebase, phone, appVerifier);

    return confirmationResult;
};

export const verifyOtp = async (confirmationResult: any, code: string) => {
    const result = await confirmationResult.confirm(code);

    const user = result.user;

    const token = await user.getIdToken();

    return token;
};
