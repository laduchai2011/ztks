import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    setData_toastMessage,
    set_isLoading,
    setIsShow_editBankDialog,
    setNewBank_editBankDialog,
} from '@src/redux/slice/Bank';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { BankField } from '@src/dataStruct/bank';
import { useEditBankMutation } from '@src/redux/query/bankRTK';

const EditBank = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isShow: boolean = useSelector((state: RootState) => state.BankSlice.editBankDialog.isShow);
    const bank: BankField | undefined = useSelector((state: RootState) => state.BankSlice.editBankDialog.bank);

    const [bank1, setBank1] = useState<BankField | undefined>(undefined);

    const [editBank] = useEditBankMutation();

    useEffect(() => {
        if (!bank) return;
        setBank1(bank);
    }, [bank]);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [isShow]);

    const handleBankCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!bank1) return;
        setBank1({ ...bank1, bankCode: e.target.value });
    };

    const handleAccountNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!bank1) return;
        setBank1({ ...bank1, accountNumber: e.target.value });
    };

    const handleAccountName = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!bank1) return;
        setBank1({ ...bank1, accountName: e.target.value });
    };

    const handleClose = () => {
        dispatch(setIsShow_editBankDialog(false));
    };

    const handleAgree = () => {
        if (!bank1) return;

        const bankCodeTrim = bank1.bankCode.trim();
        const accountNumberTrim = bank1.accountNumber.trim();
        const accountNameTrim = bank1.accountName.trim();

        if (bankCodeTrim === '' || accountNumberTrim === '' || accountNameTrim === '') {
            dispatch(
                setData_toastMessage({ type: messageType_enum.ERROR, message: 'Không được để trống trường nào !' })
            );
            return;
        }

        dispatch(set_isLoading(true));
        editBank({
            id: bank1.id,
            bankCode: bankCodeTrim,
            accountNumber: accountNumberTrim,
            accountName: accountNameTrim,
            accountId: -1,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(
                        setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Chỉnh sửa thành công !' })
                    );
                    dispatch(setIsShow_editBankDialog(false));
                    dispatch(setNewBank_editBankDialog(resData.data));
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
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.content}>
                        <input
                            value={bank1?.bankCode || ''}
                            onChange={(e) => handleBankCode(e)}
                            placeholder="Mã ngân hàng"
                        />
                    </div>
                    <div className={style.content}>
                        <input
                            value={bank1?.accountNumber || ''}
                            onChange={(e) => handleAccountNumber(e)}
                            placeholder="Số tài khoản"
                        />
                    </div>
                    <div className={style.content}>
                        <input
                            value={bank1?.accountName || ''}
                            onChange={(e) => handleAccountName(e)}
                            placeholder="Tên tài khoản"
                        />
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditBank);
