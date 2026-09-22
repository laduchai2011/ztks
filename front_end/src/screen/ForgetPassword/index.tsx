import { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SIGNIN, ACCOUNT, SIGNUP, FORGET_PASSWORD, PHONE_NUMBER, SEND, NEW_PASSWORD } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { messageType_enum } from '@src/component/ToastMessage/type';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import OtpInput from './component/OtpInput';
import { sendOtp } from '@src/otp/handle';
import { formatPhone, handleSrcImage } from '@src/utility/string';
import {
    set__is_show__otp_dialog,
    set__token__otp_dialog,
    set__is_loading,
    set__data__toast_message,
} from '@src/redux/slice/Forget_Password';
import { use_forget_Password_Mutation, useLazy_check_Forget_Password_Query } from '@src/redux/query/account_RTK';
import { isSpace, containsSpecialCharacters } from '@src/utility/string';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const token: string = useSelector((state: RootState) => state.Forget_Password_Slice.otp_dialog.token);

    const [confirmation, set__confirmation] = useState<any>(null);
    const [user_name, set__user_name] = useState<string>('');
    const [phone_number, set__phone_number] = useState<string>('');
    const [new_password, set__new_password] = useState<string>('');

    const [forget_Password] = use_forget_Password_Mutation();
    const [check_Forget_Password] = useLazy_check_Forget_Password_Query();

    const handle_Go_To_Signin = () => {
        navigate(route_enum.SIGNIN);
    };

    const handle_Go_To_Signup = () => {
        navigate(route_enum.SIGNUP);
    };

    const handle_Change_User_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__user_name(e.target.value);
    };

    const handle_Change_Phone_Number = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__phone_number(e.target.value);
    };

    const handle_Change_New_Password = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__new_password(e.target.value);
    };

    useEffect(() => {
        if (token.length === 0) return;
        dispatch(set__is_loading(true));
        forget_Password({
            body: { user_name: user_name.trim(), phone: phone_number.trim(), password: new_password.trim() },
            token: token,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(
                        set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Đổi mật khẩu thành công' })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: res_data?.message || 'Đổi mật khẩu thất bại',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(set__token__otp_dialog(''));
                dispatch(set__is_loading(false));
            });
    }, [dispatch, token, forget_Password, user_name, new_password, phone_number]);

    const handle_Send = async () => {
        const user_name_trim = user_name.trim();
        const new_password_trim = new_password.trim();
        const phone_trim = formatPhone(phone_number.trim());
        if (user_name_trim.length === 0) {
            dispatch(
                set__data__toast_message({ type: messageType_enum.ERROR, message: 'Vui lòng nhập tên tài khoản' })
            );
            return;
        }
        if (phone_trim.length === 0) {
            dispatch(
                set__data__toast_message({ type: messageType_enum.ERROR, message: 'Vui lòng nhập số điện thoại' })
            );
            return;
        }
        if (new_password_trim.length === 0) {
            dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Vui lòng nhập mật khẩu mới' }));
            return;
        } else {
            if (isSpace(new_password_trim)) {
                dispatch(
                    set__data__toast_message({ type: messageType_enum.ERROR, message: 'Không được có khoảng trắng' })
                );
                return;
            } else if (containsSpecialCharacters(new_password_trim)) {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Mật khẩu không được chứa ký tự đặc biệt !',
                    })
                );
                return;
            }
        }

        const res_check = await check_Forget_Password({ user_name: user_name_trim, phone: phone_trim });
        const res_check_data = res_check.data;
        if (!(res_check_data?.is_success && res_check_data.data)) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: res_check_data?.message || 'Tài khoản hoặc số điện thoại không đúng',
                })
            );
            return;
        }

        const res = await sendOtp(phone_trim);
        set__confirmation(res);
        dispatch(set__is_show__otp_dialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.logo}>
                    <img src={handleSrcImage('logo.jpg')} alt="logo" />
                </div>
                <div className={style.headerContainer}>{FORGET_PASSWORD}</div>
                <div className={style.inputContainer}>
                    <div className={style.aInput}>
                        <div>{ACCOUNT}</div>
                        <input
                            value={user_name}
                            onChange={(e) => handle_Change_User_Name(e)}
                            type="text"
                            placeholder="Nhập tài khoản"
                        />
                    </div>
                    <div className={style.aInput}>
                        <div>{PHONE_NUMBER}</div>
                        <input
                            value={phone_number}
                            onChange={(e) => handle_Change_Phone_Number(e)}
                            type="text"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div className={style.aInput}>
                        <div>{NEW_PASSWORD}</div>
                        <input
                            value={new_password}
                            onChange={(e) => handle_Change_New_Password(e)}
                            type="password"
                            placeholder="Mật khẩu mới"
                        />
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <div onClick={() => handle_Send()}>{SEND}</div>
                </div>
                <div className={style.options}>
                    <div onClick={() => handle_Go_To_Signin()}>{SIGNIN}</div>
                    <div onClick={() => handle_Go_To_Signup()}>{SIGNUP}</div>
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
