import { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SIGNIN, ACCOUNT, SIGNUP, FORGET_PASSWORD, PHONE_NUMBER, SEND, PASSWORD } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { messageType_enum } from '@src/component/ToastMessage/type';
// import { AccountField } from '@src/dataStruct/account';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import OtpInput from './component/OtpInput';
import { sendOtp } from '@src/otp/handle';
import { formatPhone } from '@src/utility/string';
import {
    setIsShow_otpDialog,
    setToken_otpDialog,
    set_isLoading,
    setData_toastMessage,
} from '@src/redux/slice/ForgetPassword';
import { useCustomerForgetPasswordMutation } from '@src/redux/query/customerRTK';
import { isSpace, containsSpecialCharacters } from '@src/utility/string';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const token: string = useSelector((state: RootState) => state.ForgetPasswordSlice.otpDialog.token);

    const [confirmation, setConfirmation] = useState<any>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');

    const [forgetPassword] = useCustomerForgetPasswordMutation();

    const handleGoToSignin = () => {
        navigate(route_enum.SIGNIN);
    };

    const handleGoToSignup = () => {
        navigate(route_enum.SIGNUP);
    };

    const handleChangePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    useEffect(() => {
        if (token.length === 0) return;
        dispatch(set_isLoading(true));
        forgetPassword({
            body: { phone: phoneNumber.trim(), password: newPassword.trim() },
            token: token,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(
                        setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Đổi mật khẩu thành công' })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: resData?.message || 'Đổi mật khẩu thất bại',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(setToken_otpDialog(''));
                dispatch(set_isLoading(false));
            });
    }, [dispatch, token, forgetPassword, newPassword, phoneNumber]);

    const handleSend = async () => {
        const newPassword_trim = newPassword.trim();
        const phone_trim = formatPhone(phoneNumber.trim());
        if (phone_trim.length === 0) {
            dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Vui lòng nhập số điện thoại' }));
            return;
        }
        if (newPassword_trim.length === 0) {
            dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Vui lòng nhập mật khẩu mới' }));
            return;
        } else {
            if (isSpace(newPassword_trim)) {
                dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Không được có khoảng trắng' }));
                return;
            } else if (containsSpecialCharacters(newPassword_trim)) {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Mật khẩu không được chứa ký tự đặc biệt !',
                    })
                );
                return;
            }
        }

        const res = await sendOtp(phone_trim);
        setConfirmation(res);
        dispatch(setIsShow_otpDialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.headerContainer}>{FORGET_PASSWORD}</div>
                <div className={style.inputContainer}>
                    <div className={style.aInput}>
                        <div>{PHONE_NUMBER}</div>
                        <input
                            value={phoneNumber}
                            onChange={(e) => handleChangePhoneNumber(e)}
                            type="text"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div className={style.aInput}>
                        <div>{PASSWORD}</div>
                        <input
                            value={newPassword}
                            onChange={(e) => handleChangeNewPassword(e)}
                            type="password"
                            placeholder="Mật khẩu mới"
                        />
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <div onClick={() => handleSend()}>{SEND}</div>
                </div>
                <div className={style.options}>
                    <div onClick={() => handleGoToSignin()}>{SIGNIN}</div>
                    <div onClick={() => handleGoToSignup()}>{SIGNUP}</div>
                </div>
            </div>
            <div>
                <MyLoading />
                <MyToastMessage />
                <OtpInput confirmation={confirmation} />
            </div>
            <div id="recaptcha-container"></div>
        </div>
    );
};

export default ForgetPassword;
