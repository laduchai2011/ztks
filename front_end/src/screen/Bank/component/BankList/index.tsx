import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { set__new_bank__add_bank, set__deleted_bank__delete_bank_dialog } from '@src/redux/slice/Bank';
import { Bank_Field } from '@src/data_struct/bank';
import { useLazy_get_All_Banks_Query } from '@src/redux/query/bank_RTK';
import OneBank from './component/OneBank';

const BankList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const new_bank: Bank_Field | undefined = useSelector((state: RootState) => state.Bank_Slice.add_bank.new_bank);
    const deleted_bank: Bank_Field | undefined = useSelector(
        (state: RootState) => state.Bank_Slice.delete_bank_dialog.deleted_bank
    );

    const [all_banks, set__all_banks] = useState<Bank_Field[]>([]);

    const [get_All_Banks] = useLazy_get_All_Banks_Query();

    useEffect(() => {
        if (!new_bank) return;
        set__all_banks((prev) => [...prev, new_bank]);
        dispatch(set__new_bank__add_bank(undefined));
    }, [dispatch, new_bank]);

    useEffect(() => {
        if (!deleted_bank) return;
        set__all_banks((prev) => prev.filter((item) => item.id !== deleted_bank.id));
        dispatch(set__deleted_bank__delete_bank_dialog(undefined));
    }, [dispatch, deleted_bank]);

    useEffect(() => {
        get_All_Banks({ account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__all_banks(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_All_Banks]);

    const list_bank = all_banks.map((item, index) => {
        return <OneBank key={item.id} item={item} index={index} />;
    });

    return <div className={style.parent}>{list_bank}</div>;
};

export default memo(BankList);
