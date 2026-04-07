import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { CREATE } from '@src/const/text';
import { useCreateVoucherMutation } from '@src/redux/query/voucherRTK';
import { formatMoney } from '@src/utility/string';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { setData_toastMessage } from '@src/redux/slice/Voucher';
import { isSpace, containsSpecialCharacters, isValidPhoneNumber, isPositiveInteger } from '@src/utility/string';
import { VoucherField } from '@src/dataStruct/voucher';

const CreateVoucher = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [datAmount, setDayAmount] = useState<string>('');
    const [money, setMoney] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [isFormattingMoney, setIsFormattingMoney] = useState(false);
    const [voucher, setVoucher] = useState<VoucherField | undefined>(undefined);

    const [createVoucher] = useCreateVoucherMutation();

    useEffect(() => {
        console.log('voucher', voucher);
    }, [voucher]);

    const handleDayAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDayAmount(value);
    };

    const handleMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMoney(value);
    };

    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);
    };

    const handleClick = async () => {
        if (!isPositiveInteger(datAmount)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Số lượng ngày phải là 1 số dương !',
                })
            );
            return;
        }

        if (!isPositiveInteger(money)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Tiền phải là 1 số dương !',
                })
            );
            return;
        }

        if (isSpace(phone)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Số điện thoại không được có khoảng trắng !',
                })
            );
            return;
        } else if (containsSpecialCharacters(phone)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Số điện thoại không được chứa ký tự đặc biệt !',
                })
            );
            return;
        } else if (!isValidPhoneNumber(phone)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Không phải là số điện thoại !',
                })
            );
            return;
        }

        try {
            const result = await createVoucher({
                dayAmount: Number(datAmount),
                money: Number(money),
                phone: phone,
                memberZtksId: -1,
            });

            const resData = result.data;
            if (resData?.isSuccess && resData.data) {
                setVoucher(resData.data);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.SUCCESS,
                        message: 'Tạo voucher thành công !',
                    })
                );
            } else {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Tạo voucher không thành công !',
                    })
                );
            }
        } catch (error) {
            console.error(error);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        }
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.inputContainer}>
                    <div>Số ngày</div>
                    <input value={datAmount} onChange={(e) => handleDayAmount(e)} />
                </div>
                <div className={style.inputContainer}>
                    <div>Tiền</div>
                    <input
                        value={isFormattingMoney && money ? formatMoney(money) : money}
                        onChange={(e) => handleMoney(e)}
                        onFocus={() => setIsFormattingMoney(false)}
                        onBlur={() => setIsFormattingMoney(true)}
                        placeholder="VND"
                    />
                </div>
                <div className={style.inputContainer}>
                    <div>Số điện thoại</div>
                    <input value={phone} onChange={(e) => handlePhone(e)} />
                </div>
                <div className={style.btnContainer}>
                    <div onClick={() => handleClick()}>{CREATE}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateVoucher);
