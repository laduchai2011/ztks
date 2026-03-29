import { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { SIGNIN, ACCOUNT, PASSWORD } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { useSigninMutation } from '@src/redux/query/accountRTK';
import { AccountField } from '@src/dataStruct/account';

const Signin = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    const [account, setAccount] = useState<AccountField>({
        id: -1,
        userName: '',
        password: '',
        phone: '',
        firstName: '',
        lastName: '',
        avatar: null,
        status: '',
        updateTime: '',
        createTime: '',
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
        if (type === 'userName') {
            setAccount({ ...account, userName: value });
        }
        if (type === 'password') {
            setAccount({ ...account, password: value });
        }
    };

    const handleSignin = () => {
        signin(account)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess) {
                    setNote('');
                    navigate(route_enum.HOME);
                    window.location.reload();
                } else {
                    setNote('Đăng nhập thất bại');
                }
            })
            .catch((err) => {
                console.error(err);
                setNote('Đã có lỗi xảy ra');
            });
    };

    // const gotoForgetPassword = () => {};

    // const gotoSignup = () => {
    //     navigate(route_enum.SIGNUP);
    // };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                {myId === null && (
                    <div className={style.main1}>
                        <div className={style.headerContainer}>{SIGNIN}</div>
                        <div className={style.inputContainer}>
                            <div className={style.aInput}>
                                <div>{ACCOUNT}</div>
                                <input value={account.userName} onChange={(e) => handleInput(e, 'userName')} />
                            </div>
                            <div className={style.aInput}>
                                <div>{PASSWORD}</div>
                                <input
                                    value={account.password}
                                    onChange={(e) => handleInput(e, 'password')}
                                    type="password"
                                />
                            </div>
                        </div>
                        <div className={style.btnContainer}>
                            <div onClick={() => handleSignin()}>{SIGNIN}</div>
                        </div>
                        {/* <div className={style.navContainer}>
                            <div onClick={() => gotoForgetPassword()}>{FORGET_PASSWORD}</div>
                            <div onClick={() => gotoSignup()}>{SIGNUP}</div>
                        </div> */}
                        {note.length > 0 && <div className={style.note}>{note}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signin;
