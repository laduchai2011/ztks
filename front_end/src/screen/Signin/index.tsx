import { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { SIGNIN, ACCOUNT, PASSWORD, SIGNUP, FORGET_PASSWORD } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { use_signin_Mutation } from '@src/redux/query/account_RTK';
import { Account_Field } from '@src/data_struct/account';
import axiosInstance from '@src/api/axiosInstance';
import { My_Response_Field } from '@src/data_struct/response';
import { handleSrcImage } from '@src/utility/string';

const Signin = () => {
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    const [account, set__account] = useState<Account_Field>({
        id: '',
        user_name: '',
        password: '',
        phone: '',
        first_name: '',
        last_name: '',
        avatar: null,
        is_delete: false,
        update_time: '',
        create_time: '',
    });
    const [note, set__note] = useState<string>('');

    const [signin] = use_signin_Mutation();

    useEffect(() => {
        if (my_id !== null) {
            navigate(route_enum.HOME);
        }
    }, [navigate, my_id]);

    const handle_Input = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const value = e.target.value;
        if (type === 'user_name') {
            set__account({ ...account, user_name: value });
        }
        if (type === 'password') {
            set__account({ ...account, password: value });
        }
    };

    const handle_Signin = () => {
        signin(account)
            .then((res) => {
                const res_data1 = res.data;
                if (res_data1?.is_success) {
                    set__note('');
                    setTimeout(() => {
                        const fetch_Check_Signin = async () => {
                            try {
                                const response = await axiosInstance.get<My_Response_Field<string>>(
                                    `/service__account/query/is_signin`
                                );
                                const res_data2 = response.data;
                                if (res_data2.is_success) {
                                    if (res_data2.data) {
                                        sessionStorage.setItem('myId', `${res_data2.data}`);
                                    } else {
                                        sessionStorage.removeItem('myId');
                                    }
                                }
                            } catch (error) {
                                console.error(error);
                            } finally {
                                window.location.reload();
                            }
                        };

                        fetch_Check_Signin();
                    }, 1500);
                } else {
                    set__note('Đăng nhập thất bại');
                }
            })
            .catch((err) => {
                console.error(err);
                set__note('Đã có lỗi xảy ra');
            });
    };

    const goto_Forget_Password = () => {
        navigate(route_enum.FORGET_PASSWORD);
    };

    const goto_Signup = () => {
        navigate(route_enum.SIGNUP);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                {my_id === null && (
                    <div className={style.main1}>
                        <div className={style.logo}>
                            <img src={handleSrcImage('logo.jpg')} alt="logo" />
                        </div>
                        <div className={style.headerContainer}>{SIGNIN}</div>
                        <div className={style.inputContainer}>
                            <div className={style.aInput}>
                                <div>{ACCOUNT}</div>
                                <input value={account.user_name} onChange={(e) => handle_Input(e, 'user_name')} />
                            </div>
                            <div className={style.aInput}>
                                <div>{PASSWORD}</div>
                                <input
                                    value={account.password}
                                    onChange={(e) => handle_Input(e, 'password')}
                                    type="password"
                                />
                            </div>
                        </div>
                        <div className={style.btnContainer}>
                            <div onClick={() => handle_Signin()}>{SIGNIN}</div>
                        </div>
                        <div className={style.navContainer}>
                            <div onClick={() => goto_Forget_Password()}>{FORGET_PASSWORD}</div>
                            <div onClick={() => goto_Signup()}>{SIGNUP}</div>
                        </div>
                        {note.length > 0 && <div className={style.note}>{note}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signin;
