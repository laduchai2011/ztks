import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SIGNIN, SIGNUP, PASSWORD, PHONE_NUMBER } from '@src/const/text';
import { CustomerField } from '@src/dataStruct/customer';
import { CreateCustomerBodyField } from '@src/dataStruct/customer/body';
import { customer_field_type, customer_enum } from './type';
import { isSpace, containsSpecialCharacters, isValidPhoneNumber } from '@src/utility/string';
import { useCreateCustomerMutation } from '@src/redux/query/customerRTK';
import { route_enum } from '@src/router/type';
import { sendOtp } from '@src/otp/handle';
import OtpInput from './component/OtpInput';
import { formatPhone } from '@src/utility/string';
import { setIsShow_otpDialog, setToken_otpDialog, set_isLoading } from '@src/redux/slice/Signup';
import { MyResponse } from '@src/dataStruct/response';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const token: string = useSelector((state: RootState) => state.SignupSlice.otpDialog.token);

    const [createCustomerBody, setCreateCustomerBody] = useState<CreateCustomerBodyField>({
        phone: '',
        password: '',
    });
    const [passwordWarn, setPasswordWarn] = useState<string>('');
    const [phoneWarn, setPhoneWarn] = useState<string>('');
    const [myRes, setMyRes] = useState<MyResponse<CustomerField> | undefined>(undefined);
    const [confirmation, setConfirmation] = useState<any>(null);

    const [createCustomer] = useCreateCustomerMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: customer_field_type) => {
        const value = e.target.value;
        checkString(value, field);
        switch (field) {
            case customer_enum.PHONE: {
                setCreateCustomerBody({ ...createCustomerBody, phone: value });
                break;
            }
            case customer_enum.PASSWORD: {
                setCreateCustomerBody({ ...createCustomerBody, password: value });
                break;
            }
            default: {
                break;
            }
        }
    };

    const checkString = (str: string, field: customer_field_type) => {
        switch (field) {
            case customer_enum.PHONE: {
                if (isSpace(str)) {
                    setPhoneWarn('Không được có khoảng trắng !');
                } else if (containsSpecialCharacters(str)) {
                    setPhoneWarn('Số điện thoại không được chứa ký tự đặc biệt !');
                } else if (!isValidPhoneNumber(str)) {
                    setPhoneWarn('Không phải là số điện thoại !');
                } else {
                    setPhoneWarn('');
                }
                break;
            }
            case customer_enum.PASSWORD: {
                if (isSpace(str)) {
                    setPasswordWarn('Không được có khoảng trắng !');
                } else if (containsSpecialCharacters(str)) {
                    setPasswordWarn('Mật khẩu không được chứa ký tự đặc biệt !');
                } else {
                    setPasswordWarn('');
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
        dispatch(set_isLoading(true));
        createCustomer({ body: createCustomerBody, token: token })
            .then((res) => {
                const resData = res.data;
                setMyRes(resData);
                // console.log(res.data);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(setToken_otpDialog(''));
                dispatch(set_isLoading(false));
            });
    }, [dispatch, token, createCustomer, createCustomerBody]);

    const handleSignup = () => {
        handleSendOtp();
    };

    const handleGoToSignin = () => {
        navigate(route_enum.SIGNIN);
    };

    const handleSendOtp = async () => {
        const phone = formatPhone(createCustomerBody.phone.trim());
        if (phone.length === 0) return;
        const res = await sendOtp(phone);
        setConfirmation(res);
        dispatch(setIsShow_otpDialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div>
                    <h3>{SIGNUP}</h3>
                </div>
                <div>
                    <div>
                        <div>{PHONE_NUMBER}</div>
                        <div>
                            <input
                                type="text"
                                maxLength={15}
                                value={createCustomerBody.phone}
                                onChange={(e) => handleChange(e, customer_enum.PHONE)}
                            />
                            {phoneWarn.length > 0 && <p>{phoneWarn}</p>}
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
                                value={createCustomerBody.password}
                                onChange={(e) => handleChange(e, customer_enum.PASSWORD)}
                            />
                            {passwordWarn.length > 0 && <p>{passwordWarn}</p>}
                        </div>
                    </div>
                </div>
                <div className={style.signupBtn}>
                    <button onClick={() => handleSignup()}>{SIGNUP}</button>
                </div>
                <div className={style.signinBtn} onClick={() => handleGoToSignin()}>{`${SIGNIN} !`}</div>
                {<div style={{ color: myRes?.isSuccess ? 'blue' : 'red' }}>{myRes?.message}</div>}
                <div id="recaptcha-container"></div>
            </div>
            <div>
                <OtpInput confirmation={confirmation} />
            </div>
        </div>
    );
};

export default Signup;
