import { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { SIGNIN, PASSWORD, SIGNUP, FORGET_PASSWORD, PHONE_NUMBER } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { useSigninMutation } from '@src/redux/query/customerRTK';
import { SigninCustomerBodyField } from '@src/dataStruct/customer/body';

const Signin = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    const [signinCustomerBody, setSigninCustomerBody] = useState<SigninCustomerBodyField>({
        phone: '',
        password: '',
    });
    const [note, setNote] = useState<string>('');

    const [signin] = useSigninMutation();

    useEffect(() => {
        if (myId !== null) {
            navigate(route_enum.HOME);
        }
    }, [navigate, myId]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const value = e.target.value;
        if (type === 'phone') {
            setSigninCustomerBody({ ...signinCustomerBody, phone: value });
        }
        if (type === 'password') {
            setSigninCustomerBody({ ...signinCustomerBody, password: value });
        }
    };

    const handleSignin = () => {
        signin(signinCustomerBody)
            .then((res) => {
                const resData = res.data;
                console.log(resData);
                if (resData?.isSuccess) {
                    setNote('');
                    setTimeout(() => {
                        navigate(route_enum.HOME);
                        window.location.reload();
                    }, 500);
                } else {
                    setNote('Đăng nhập thất bại');
                }
            })
            .catch((err) => {
                console.error(err);
                setNote('Đã có lỗi xảy ra');
            });
    };

    const gotoForgetPassword = () => {
        navigate(route_enum.FORGET_PASSWORD);
    };

    const gotoSignup = () => {
        navigate(route_enum.SIGNUP);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                {myId === null && (
                    <div className={style.main1}>
                        <div className={style.headerContainer}>{SIGNIN}</div>
                        <div className={style.inputContainer}>
                            <div className={style.aInput}>
                                <div>{PHONE_NUMBER}</div>
                                <input value={signinCustomerBody.phone} onChange={(e) => handleInput(e, 'phone')} />
                            </div>
                            <div className={style.aInput}>
                                <div>{PASSWORD}</div>
                                <input
                                    value={signinCustomerBody.password}
                                    onChange={(e) => handleInput(e, 'password')}
                                    type="password"
                                />
                            </div>
                        </div>
                        <div className={style.btnContainer}>
                            <div onClick={() => handleSignin()}>{SIGNIN}</div>
                        </div>
                        <div className={style.navContainer}>
                            <div onClick={() => gotoForgetPassword()}>{FORGET_PASSWORD}</div>
                            <div onClick={() => gotoSignup()}>{SIGNUP}</div>
                        </div>
                        {note.length > 0 && <div className={style.note}>{note}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signin;
