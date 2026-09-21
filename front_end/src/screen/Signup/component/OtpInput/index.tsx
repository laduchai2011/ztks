import { FC, memo, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE } from '@src/const/text';
import { setIsShow_otpDialog, setToken_otpDialog, set_isLoading, setData_toastMessage } from '@src/redux/slice/Signup';
import { verifyOtp } from '@src/otp/handle';
import { messageType_enum } from '@src/component/ToastMessage/type';

const OtpInput: FC<{ confirmation: any }> = ({ confirmation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const isShow: boolean = useSelector((state: RootState) => state.SignupSlice.otpDialog.isShow);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [isShow]);

    const handleClose = () => {
        dispatch(setIsShow_otpDialog(false));
    };

    const handleVerify = async (otp: string) => {
        const token = await verifyOtp(confirmation, otp);
        return token;
    };

    const handleChange = async (value: string, index: number) => {
        if (!/^\d$/.test(value)) return;

        const input = inputsRef.current[index];
        if (!input) return;

        input.value = value;

        if (index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }

        // 🔥 check đủ OTP
        const otpArray = inputsRef.current.map((i) => i?.value || '');
        const otp = otpArray.join('');
        const isComplete = otpArray.every((v) => v !== '');

        if (isComplete && index === 5) {
            try {
                dispatch(set_isLoading(true));
                const token = await handleVerify(otp);
                dispatch(setToken_otpDialog(token));
                dispatch(setIsShow_otpDialog(false));
            } catch (error) {
                console.error('OTP verification failed:', error);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Mã OTP không đúng!',
                    })
                );
            } finally {
                dispatch(set_isLoading(false));
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace') {
            if (inputsRef.current[index]?.value === '') {
                if (index > 0) {
                    inputsRef.current[index - 1]?.focus();
                }
            } else {
                inputsRef.current[index]!.value = '';
            }
        }
    };

    // 🚀 xử lý paste OTP
    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(paste)) return;

        paste.split('').forEach((char, i) => {
            if (inputsRef.current[i]) {
                inputsRef.current[i]!.value = char;
            }
        });

        inputsRef.current[paste.length - 1]?.focus();
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.text}>Nhập mã OTP</div>
                    <div className={style.inputContainer}>
                        {[...Array(6)].map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                ref={(el) => {
                                    inputsRef.current[index] = el;
                                }}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={(e) => e.target.select()}
                                onPaste={handlePaste}
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(OtpInput);
