import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { formatMoney } from '@src/utility/string';
import { WalletField, RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { AccountField } from '@src/dataStruct/account';
import { useLazyMemberGetRequireTakeMoneyOfWalletQuery } from '@src/redux/query/walletRTK';
import {
    setIsShow_takeMoneyDialog,
    setRequiredTakeMoney_takeMoneyDialog,
    setWallet_takeMoneyDialog,
} from '@src/redux/slice/Wallet';

const Overview: FC<{ wallet: WalletField }> = ({ wallet }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [textBtn, setTextBtn] = useState<string>('Rút tiền');
    const [requireTakeMoney, setRequireTakeMoney] = useState<RequireTakeMoneyField | undefined>(undefined);

    const [getRequireTakeMoney] = useLazyMemberGetRequireTakeMoneyOfWalletQuery();

    useEffect(() => {
        if (!account) return;
        getRequireTakeMoney({ walletId: wallet.id, accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRequireTakeMoney(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getRequireTakeMoney, account, wallet]);

    useEffect(() => {
        if (requireTakeMoney) {
            setTextBtn('Chỉnh sửa yêu cầu rút tiền');
        } else {
            setTextBtn('Tạo yêu cầu rút tiền mới');
        }
    }, [requireTakeMoney]);

    const handleOpenRequireTakeMoney = () => {
        dispatch(setIsShow_takeMoneyDialog(true));
        dispatch(setWallet_takeMoneyDialog(wallet));
        dispatch(setRequiredTakeMoney_takeMoneyDialog(requireTakeMoney));
    };

    return (
        <div className={style.parent}>
            <div className={style.money}>{formatMoney(wallet.amount)}</div>
            <div className={style.transfer}>
                <div className={style.txt}>{requireTakeMoney && <div>Tiền muốn rút: {formatMoney(10000000)}</div>}</div>
                <div className={style.btn} onClick={() => handleOpenRequireTakeMoney()}>
                    {textBtn}
                </div>
            </div>
        </div>
    );
};

export default memo(Overview);
