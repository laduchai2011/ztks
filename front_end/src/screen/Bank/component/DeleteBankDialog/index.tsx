import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    setData_toastMessage,
    set_isLoading,
    setIsShow_deleteBankDialog,
    setDeletedBank_deleteBankDialog,
} from '@src/redux/slice/Bank';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { BankField } from '@src/dataStruct/bank';
import { useDeleteBankMutation } from '@src/redux/query/bankRTK';

const DeleteBankDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isShow: boolean = useSelector((state: RootState) => state.BankSlice.deleteBankDialog.isShow);
    const bank: BankField | undefined = useSelector((state: RootState) => state.BankSlice.deleteBankDialog.bank);

    const [bank1, setBank1] = useState<BankField | undefined>(undefined);

    const [deleteBank] = useDeleteBankMutation();

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

    const handleClose = () => {
        dispatch(setIsShow_deleteBankDialog(false));
    };

    const handleAgree = () => {
        if (!bank1) return;
        dispatch(set_isLoading(true));
        deleteBank({ id: bank1.id, accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData?.data) {
                    dispatch(setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Xóa thành công !' }));
                    dispatch(setIsShow_deleteBankDialog(false));
                    dispatch(setDeletedBank_deleteBankDialog(resData.data));
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
                        <div>{bank1?.bankCode}</div>
                    </div>
                    <div className={style.content}>
                        <div>{bank1?.accountNumber}</div>
                    </div>
                    <div className={style.content}>
                        <div>{bank1?.accountName}</div>
                    </div>
                    <div className={style.text}>Bạn có chắc chắn muốn xóa ngân hàng này không ?</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteBankDialog);
