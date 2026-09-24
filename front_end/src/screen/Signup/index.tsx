import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SIGNIN, SIGNUP, ACCOUNT, PASSWORD, PHONE_NUMBER, FIRST_NAME, LAST_NAME } from '@src/const/text';
import { Account_Field } from '@src/data_struct/account';
import { account_field_type, account_enum } from './type';
import { isSpace, isFirstNumber, containsSpecialCharacters, isValidPhoneNumber } from '@src/utility/string';
import { use_signup_Mutation } from '@src/redux/query/account_RTK';
import { router_res_type } from '@src/interface';
import { route_enum } from '@src/router/type';
import { sendOtp } from '@src/otp/handle';
import OtpInput from './component/OtpInput';
import { formatPhone } from '@src/utility/string';
import { set__is_show__otp_dialog, set__token__otp_dialog, set__is_loading } from '@src/redux/slice/Signup';
import { handleSrcImage } from '@src/utility/string';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const token: string = useSelector((state: RootState) => state.Signup_Slice.otp_dialog.token);

    const [account, setAccount] = useState<Account_Field>({
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
    const [user_name_warn, set__user_name_warn] = useState<string>('');
    const [password_warn, set__password_warn] = useState<string>('');
    const [phone_warn, set__phone_warn] = useState<string>('');
    const [first_name_warn, set__first_name_warn] = useState<string>('');
    const [last_name_warn, set__last_name_warn] = useState<string>('');
    const [my_res, set__my_res] = useState<router_res_type | undefined>(undefined);
    const [confirmation, set__confirmation] = useState<any>(null);

    const [signup] = use_signup_Mutation();

    const handle_Change = (e: React.ChangeEvent<HTMLInputElement>, field: account_field_type) => {
        const value = e.target.value;
        check_String(value, field);
        switch (field) {
            case account_enum.USERNAME: {
                setAccount({ ...account, user_name: value });
                break;
            }
            case account_enum.PASSWORD: {
                setAccount({ ...account, password: value });
                break;
            }
            case account_enum.PHONE: {
                setAccount({ ...account, phone: value });
                break;
            }
            case account_enum.FIRST_NAME: {
                setAccount({ ...account, first_name: value });
                break;
            }
            case account_enum.LAST_NAME: {
                setAccount({ ...account, last_name: value });
                break;
            }
            default: {
                break;
            }
        }
    };

    const check_String = (str: string, field: account_field_type) => {
        switch (field) {
            case account_enum.USERNAME: {
                if (isSpace(str)) {
                    set__user_name_warn('Không được có khoảng trắng !');
                } else if (isFirstNumber(str)) {
                    set__user_name_warn('Ký tự đầu tiên không được là số !');
                } else if (containsSpecialCharacters(str)) {
                    set__user_name_warn('Tên tài khoản không được chứa ký tự đặc biệt !');
                } else {
                    set__user_name_warn('');
                }
                break;
            }
            case account_enum.PASSWORD: {
                if (isSpace(str)) {
                    set__password_warn('Không được có khoảng trắng !');
                } else if (containsSpecialCharacters(str)) {
                    set__password_warn('Mật khẩu không được chứa ký tự đặc biệt !');
                } else {
                    set__password_warn('');
                }
                break;
            }
            case account_enum.PHONE: {
                if (isSpace(str)) {
                    set__phone_warn('Không được có khoảng trắng !');
                } else if (containsSpecialCharacters(str)) {
                    set__phone_warn('Số điện thoại không được chứa ký tự đặc biệt !');
                } else if (!isValidPhoneNumber(str)) {
                    set__phone_warn('Không phải là số điện thoại !');
                } else {
                    set__phone_warn('');
                }
                break;
            }
            case account_enum.FIRST_NAME: {
                if (containsSpecialCharacters(str)) {
                    set__first_name_warn('Tên không được chứa ký tự đặc biệt !');
                } else {
                    set__first_name_warn('');
                }
                break;
            }
            case account_enum.LAST_NAME: {
                if (containsSpecialCharacters(str)) {
                    set__last_name_warn('Tên không được chứa ký tự đặc biệt !');
                } else {
                    set__last_name_warn('');
                }
                break;
            }
            default: {
                break;
            }
        }
    };

    useEffect(() => {
        if (token.length === 0) return;
        dispatch(set__is_loading(true));
        signup({ body: account, token: token })
            .then((res) => {
                set__my_res(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(set__token__otp_dialog(''));
                dispatch(set__is_loading(false));
            });
    }, [dispatch, token, account, signup]);

    const handle_Signup = () => {
        handle_Send_Otp();
    };

    const handle_Go_To_Signin = () => {
        navigate(route_enum.SIGNIN);
    };

    const handle_Send_Otp = async () => {
        const phone = formatPhone(account.phone.trim());
        if (phone.length === 0) return;
        const res = await sendOtp(phone);
        set__confirmation(res);
        dispatch(set__is_show__otp_dialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.logo}>
                    <img src={handleSrcImage('logo.jpg')} alt="logo" />
                </div>
                <div>
                    <h3>{SIGNUP}</h3>
                </div>
                <div>
                    <div>
                        <div>{ACCOUNT}</div>
                        <div>
                            <input
                                type="text"
                                maxLength={100}
                                value={account.user_name}
                                onChange={(e) => handle_Change(e, account_enum.USERNAME)}
                            />
                            {user_name_warn.length > 0 && <p>{user_name_warn}</p>}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>{PASSWORD}</div>
                        <div>
                            <input
                                type="password"
                                maxLength={100}
                                value={account.password}
                                onChange={(e) => handle_Change(e, account_enum.PASSWORD)}
                            />
                            {password_warn.length > 0 && <p>{password_warn}</p>}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>{PHONE_NUMBER}</div>
                        <div>
                            <input
                                type="text"
                                maxLength={15}
                                value={account.phone}
                                onChange={(e) => handle_Change(e, account_enum.PHONE)}
                            />
                            {phone_warn.length > 0 && <p>{phone_warn}</p>}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>{FIRST_NAME}</div>
                        <div>
                            <input
                                type="text"
                                maxLength={20}
                                value={account.first_name}
                                onChange={(e) => handle_Change(e, account_enum.FIRST_NAME)}
                            />
                            {first_name_warn.length > 0 && <p>{first_name_warn}</p>}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>{LAST_NAME}</div>
                        <div>
                            <input
                                type="text"
                                maxLength={20}
                                value={account.last_name}
                                onChange={(e) => handle_Change(e, account_enum.LAST_NAME)}
                            />
                            {last_name_warn.length > 0 && <p>{last_name_warn}</p>}
                        </div>
                    </div>
                </div>
                <div className={style.signupBtn}>
                    <button onClick={() => handle_Signup()}>{SIGNUP}</button>
                </div>
                <div onClick={() => handle_Go_To_Signin()}>{`${SIGNIN} !`}</div>
                {<div style={{ color: my_res?.status === 'error' ? 'red' : 'black' }}>{my_res?.message}</div>}
                <div id="recaptcha-container"></div>
            </div>
            <div>
                <OtpInput confirmation={confirmation} />
            </div>
        </div>
    );
};

export default Signup;
