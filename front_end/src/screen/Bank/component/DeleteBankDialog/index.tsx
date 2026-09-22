import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__is_show__delete_bank_dialog,
    set__deleted_bank__delete_bank_dialog,
} from '@src/redux/slice/Bank';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Bank_Field } from '@src/data_struct/bank';
import { use_delete_Bank_Mutation } from '@src/redux/query/bank_RTK';

const DeleteBankDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const is_show: boolean = useSelector((state: RootState) => state.Bank_Slice.delete_bank_dialog.is_show);
    const bank: Bank_Field | undefined = useSelector((state: RootState) => state.Bank_Slice.delete_bank_dialog.bank);

    const [bank1, set__bank1] = useState<Bank_Field | undefined>(undefined);

    const [delete_Bank] = use_delete_Bank_Mutation();

    useEffect(() => {
        if (!bank) return;
        set__bank1(bank);
    }, [bank]);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
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
    }, [is_show]);

    const handle_Close = () => {
        dispatch(set__is_show__delete_bank_dialog(false));
    };

    const handle_Agree = () => {
        if (!bank1) return;
        dispatch(set__is_loading(true));
        delete_Bank({ id: bank1.id, account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    dispatch(set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Xóa thành công !' }));
                    dispatch(set__is_show__delete_bank_dialog(false));
                    dispatch(set__deleted_bank__delete_bank_dialog(res_data.data));
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.content}>
                        <div>{bank1?.bank_code}</div>
                    </div>
                    <div className={style.content}>
                        <div>{bank1?.account_number}</div>
                    </div>
                    <div className={style.content}>
                        <div>{bank1?.account_name}</div>
                    </div>
                    <div className={style.text}>Bạn có chắc chắn muốn xóa ngân hàng này không ?</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteBankDialog);
