import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { setNewBank_addBank, setDeletedBank_deleteBankDialog } from '@src/redux/slice/Bank';
import { BankField } from '@src/dataStruct/bank';
import { useLazyGetAllBanksQuery } from '@src/redux/query/bankRTK';
import OneBank from './component/OneBank';

const BankList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const newBank: BankField | undefined = useSelector((state: RootState) => state.BankSlice.addBank.newBank);
    const deletedBank: BankField | undefined = useSelector(
        (state: RootState) => state.BankSlice.deleteBankDialog.deletedBank
    );

    const [allBanks, setAllBanks] = useState<BankField[]>([]);

    const [getAllBanks] = useLazyGetAllBanksQuery();

    useEffect(() => {
        if (!newBank) return;
        setAllBanks((prev) => [...prev, newBank]);
        dispatch(setNewBank_addBank(undefined));
    }, [dispatch, newBank]);

    useEffect(() => {
        if (!deletedBank) return;
        setAllBanks((prev) => prev.filter((item) => item.id !== deletedBank.id));
        dispatch(setDeletedBank_deleteBankDialog(undefined));
    }, [dispatch, deletedBank]);

    useEffect(() => {
        getAllBanks({ accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setAllBanks(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getAllBanks]);

    const list_bank = allBanks.map((item, index) => {
        return <OneBank key={item.id} item={item} index={index} />;
    });

    return <div className={style.parent}>{list_bank}</div>;
};

export default memo(BankList);
