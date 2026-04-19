import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { BANK_CODE, ACCOUNT_NUMBER, ACCOUNT_NAME, EDIT, DELETE } from '@src/const/text';
import { BankField } from '@src/dataStruct/bank';
import { setIsShow_editBankDialog, setBank_editBankDialog } from '@src/redux/slice/Bank';

const OneBank = ({ item, index }: { item: BankField; index: number }) => {
    const dispatch = useDispatch<AppDispatch>();

    const newBank: BankField | undefined = useSelector((state: RootState) => state.BankSlice.editBankDialog.newBank);

    const [bank1, setBank1] = useState<BankField>(item);

    useEffect(() => {
        if (!newBank) return;
        if (newBank.id === item.id) {
            setBank1(newBank);
        }
    }, [newBank, item.id]);

    const handleOpenEdit = () => {
        dispatch(setBank_editBankDialog(item));
        dispatch(setIsShow_editBankDialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>{index + 1}</div>
                <div>
                    <FaRegEdit onClick={() => handleOpenEdit()} title={EDIT} color="green" />
                    <MdOutlineDelete size={20} title={DELETE} color="red" />
                </div>
            </div>
            <div className={style.content}>
                <div>{BANK_CODE}</div>
                <div>{bank1.bankCode}</div>
            </div>
            <div className={style.content}>
                <div>{ACCOUNT_NUMBER}</div>
                <div>{bank1.accountNumber}</div>
            </div>
            <div className={style.content}>
                <div>{ACCOUNT_NAME}</div>
                <div>{bank1.accountName}</div>
            </div>
        </div>
    );
};

export default memo(OneBank);
