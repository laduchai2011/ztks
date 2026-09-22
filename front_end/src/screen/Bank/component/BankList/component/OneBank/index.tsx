import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { BANK_CODE, ACCOUNT_NUMBER, ACCOUNT_NAME, EDIT, DELETE } from '@src/const/text';
import { Bank_Field } from '@src/data_struct/bank';
import {
    set__is_show__edit_bank_dialog,
    set__bank__edit_bank_dialog,
    set__is_show__delete_bank_dialog,
    set__bank__delete_bank_dialog,
} from '@src/redux/slice/Bank';

const OneBank = ({ item, index }: { item: Bank_Field; index: number }) => {
    const dispatch = useDispatch<AppDispatch>();

    const new_bank: Bank_Field | undefined = useSelector(
        (state: RootState) => state.Bank_Slice.edit_bank_dialog.new_bank
    );

    const [bank1, set__bank1] = useState<Bank_Field>(item);

    useEffect(() => {
        if (!new_bank) return;
        if (new_bank.id === item.id) {
            set__bank1(new_bank);
        }
    }, [new_bank, item.id]);

    const handle_Open_Edit = () => {
        dispatch(set__bank__edit_bank_dialog(item));
        dispatch(set__is_show__edit_bank_dialog(true));
    };

    const handle_Open_Delete = () => {
        dispatch(set__bank__delete_bank_dialog(item));
        dispatch(set__is_show__delete_bank_dialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>{index + 1}</div>
                <div>
                    <FaRegEdit onClick={() => handle_Open_Edit()} title={EDIT} color="green" />
                    <MdOutlineDelete onClick={() => handle_Open_Delete()} size={20} title={DELETE} color="red" />
                </div>
            </div>
            <div className={style.content}>
                <div>{BANK_CODE}</div>
                <div>{bank1.bank_code}</div>
            </div>
            <div className={style.content}>
                <div>{ACCOUNT_NUMBER}</div>
                <div>{bank1.account_number}</div>
            </div>
            <div className={style.content}>
                <div>{ACCOUNT_NAME}</div>
                <div>{bank1.account_name}</div>
            </div>
        </div>
    );
};

export default memo(OneBank);
