import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { ADD_BANK } from '@src/const/text';
import { useAddBankMutation } from '@src/redux/query/bankRTK';
import { setData_toastMessage, set_isLoading, setNewBank_addBank } from '@src/redux/slice/Bank';
import { messageType_enum } from '@src/component/ToastMessage/type';

const AddBank = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [isShowParent, setIsShowParent] = useState(false);
    const [isDisplayBtn, setIsDisplayBtn] = useState(true);
    const [isShowBtn, setIsShowBtn] = useState(true);
    const [isDisplayIcon, setIsDisplayIcon] = useState(false);
    const [isShowIcon, setIsShowIcon] = useState(false);

    const [bankCode, setBankCode] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [accountName, setAccountName] = useState<string>('');

    const [addBank] = useAddBankMutation();

    const handleHBtn = () => {
        setIsShowParent(true);
        setIsShowBtn(false);
        setTimeout(() => {
            setIsDisplayBtn(false);
        }, 300);
        setIsDisplayIcon(true);
        setTimeout(() => {
            setIsShowIcon(true);
        }, 10);
    };

    const handleHIcon = () => {
        setIsShowParent(false);
        setIsShowIcon(false);
        setTimeout(() => {
            setIsDisplayIcon(false);
        }, 300);
        setIsDisplayBtn(true);
        setTimeout(() => {
            setIsShowBtn(true);
        }, 10);
    };

    const handleBankCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBankCode(e.target.value);
    };

    const handleAccountNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountNumber(e.target.value);
    };

    const handleAccountName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountName(e.target.value);
    };

    const handleCreate = () => {
        const bankCodeTrim = bankCode.trim();
        const accountNumberTrim = accountNumber.trim();
        const accountNameTrim = accountName.trim();

        if (bankCodeTrim === '' || accountNumberTrim === '' || accountNameTrim === '') {
            dispatch(
                setData_toastMessage({ type: messageType_enum.ERROR, message: 'Không được để trống trường nào !' })
            );
            return;
        }

        dispatch(set_isLoading(true));
        addBank({
            bankCode: bankCodeTrim,
            accountNumber: accountNumberTrim,
            accountName: accountNameTrim,
            accountId: -1,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Thêm thành công !' }));
                    dispatch(setNewBank_addBank(resData.data));
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={`${style.parent} ${isShowParent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${isDisplayBtn ? style.display : ''} ${isShowBtn ? style.show : ''}`}
                    onClick={() => handleHBtn()}
                >
                    {ADD_BANK}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${isDisplayIcon ? style.display : ''} ${isShowIcon ? style.show : ''}`}
                    onClick={() => handleHIcon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div>
                    <input value={bankCode} onChange={(e) => handleBankCode(e)} placeholder="Mã ngân hàng" />
                </div>
                <div>
                    <input value={accountNumber} onChange={(e) => handleAccountNumber(e)} placeholder="Số tài khoản" />
                </div>
                <div>
                    <input value={accountName} onChange={(e) => handleAccountName(e)} placeholder="Tên tài khoản" />
                </div>
                <div>
                    <div onClick={() => handleCreate()}>{ADD_BANK}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(AddBank);
