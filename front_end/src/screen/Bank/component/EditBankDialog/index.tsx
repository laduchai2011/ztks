import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set__is_loading,
    set__data__toast_message,
    set__is_show__edit_bank_dialog,
    set__new_bank__edit_bank_dialog,
} from '@src/redux/slice/Bank';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Bank_Field } from '@src/data_struct/bank';
import { use_edit_Bank_Mutation } from '@src/redux/query/bank_RTK';

const EditBankDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const is_show: boolean = useSelector((state: RootState) => state.Bank_Slice.edit_bank_dialog.is_show);
    const bank: Bank_Field | undefined = useSelector((state: RootState) => state.Bank_Slice.edit_bank_dialog.bank);

    const [bank1, set__bank1] = useState<Bank_Field | undefined>(undefined);

    const [edit_Bank] = use_edit_Bank_Mutation();

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

    const handle_Bank_Code = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!bank1) return;
        set__bank1({ ...bank1, bank_code: e.target.value });
    };

    const handle_Account_Number = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!bank1) return;
        set__bank1({ ...bank1, account_number: e.target.value });
    };

    const handle_Account_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!bank1) return;
        set__bank1({ ...bank1, account_name: e.target.value });
    };

    const handle_Close = () => {
        dispatch(set__is_show__edit_bank_dialog(false));
    };

    const handle_Agree = () => {
        if (!bank1) return;

        const bank_code_trim = bank1.bank_code.trim();
        const account_number_trim = bank1.account_number.trim();
        const account_name_trim = bank1.account_name.trim();

        if (bank_code_trim === '' || account_number_trim === '' || account_name_trim === '') {
            dispatch(
                set__data__toast_message({ type: messageType_enum.ERROR, message: 'Không được để trống trường nào !' })
            );
            return;
        }

        dispatch(set__is_loading(true));
        edit_Bank({
            id: bank1.id,
            bank_code: bank_code_trim,
            account_number: account_number_trim,
            account_name: account_name_trim,
            account_id: '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(
                        set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Chỉnh sửa thành công !' })
                    );
                    dispatch(set__is_show__edit_bank_dialog(false));
                    dispatch(set__new_bank__edit_bank_dialog(res_data.data));
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
                        <input
                            value={bank1?.bank_code || ''}
                            onChange={(e) => handle_Bank_Code(e)}
                            placeholder="Mã ngân hàng"
                        />
                    </div>
                    <div className={style.content}>
                        <input
                            value={bank1?.account_number || ''}
                            onChange={(e) => handle_Account_Number(e)}
                            placeholder="Số tài khoản"
                        />
                    </div>
                    <div className={style.content}>
                        <input
                            value={bank1?.account_name || ''}
                            onChange={(e) => handle_Account_Name(e)}
                            placeholder="Tên tài khoản"
                        />
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditBankDialog);
