import { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { SIGNIN, ACCOUNT, SIGNUP, FORGET_PASSWORD, PHONE_NUMBER, SEND } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { AccountField } from '@src/dataStruct/account';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import OtpInput from './component/OtpInput';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [confirmation, setConfirmation] = useState<any>(null);

    const handleGoToSignin = () => {
        navigate(route_enum.SIGNIN);
    };

    const handleGoToSignup = () => {
        navigate(route_enum.SIGNUP);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.headerContainer}>{FORGET_PASSWORD}</div>
                <div className={style.inputContainer}>
                    <div className={style.aInput}>
                        <div>{ACCOUNT}</div>
                        <input type="text" placeholder="Nhập tài khoản" />
                    </div>
                    <div className={style.aInput}>
                        <div>{PHONE_NUMBER}</div>
                        <input type="text" placeholder="Nhập số điện thoại" />
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <div>{SEND}</div>
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
        </div>
    );
};

export default ForgetPassword;
