import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { formatMoney } from '@src/utility/string';
import { WalletField, RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { AccountField } from '@src/dataStruct/account';
import { useLazyMemberGetRequireTakeMoneyOfWalletQuery } from '@src/redux/query/walletRTK';
import {
    set_isLoading,
    setData_toastMessage,
    setIsShow_takeMoneyDialog,
    setRequiredTakeMoney_takeMoneyDialog,
    setWallet_takeMoneyDialog,
    setNewRequireTakeMoney_takeMoneyDialog,
} from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useDeleteRequireTakeMoneyMutation } from '@src/redux/query/walletRTK';
import { DELETE } from '@src/const/text';

const Overview: FC<{ wallet: WalletField }> = ({ wallet }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const newRequireTakeMoney: RequireTakeMoneyField | undefined = useSelector(
        (state: RootState) => state.WalletSlice.takeMoneyDialog.newRequireTakeMoney
    );

    const [textBtn, setTextBtn] = useState<string>('Rút tiền');
    const [requireTakeMoney, setRequireTakeMoney] = useState<RequireTakeMoneyField | undefined>(undefined);

    const [getRequireTakeMoney] = useLazyMemberGetRequireTakeMoneyOfWalletQuery();
    const [deleteRequireTakeMoney] = useDeleteRequireTakeMoneyMutation();

    useEffect(() => {
        if (!account) return;
        getRequireTakeMoney({ walletId: wallet.id, accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRequireTakeMoney(resData.data);
                } else {
                    setRequireTakeMoney(undefined);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getRequireTakeMoney, account, wallet]);

    useEffect(() => {
        if (requireTakeMoney) {
            setTextBtn('Chỉnh sửa ');
        } else {
            setTextBtn('Tạo');
        }
    }, [requireTakeMoney]);

    useEffect(() => {
        if (!newRequireTakeMoney) return;
        setRequireTakeMoney(newRequireTakeMoney);
        dispatch(setNewRequireTakeMoney_takeMoneyDialog(undefined));
    }, [dispatch, newRequireTakeMoney]);

    const handleOpenRequireTakeMoney = () => {
        dispatch(setIsShow_takeMoneyDialog(true));
        dispatch(setWallet_takeMoneyDialog(wallet));
        dispatch(setRequiredTakeMoney_takeMoneyDialog(requireTakeMoney));
    };

    const handleDelReqTakeMoney = () => {
        if (!requireTakeMoney) return;
        dispatch(set_isLoading(true));
        deleteRequireTakeMoney({
            requireTakeMoneyId: requireTakeMoney.id,
            accountId: -1,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRequireTakeMoney(undefined);
                    dispatch(
                        setData_toastMessage({
                            message: 'Xóa thành công',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            message: 'Xóa không thành công',
                            type: messageType_enum.ERROR,
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    setData_toastMessage({
                        message: 'Đã có lỗi xảy ra',
                        type: messageType_enum.ERROR,
                    })
                );
                console.error(err);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={style.parent}>
            <div className={style.money}>{formatMoney(wallet.amount)}</div>
            <div className={style.transfer}>
                <div className={style.title}>
                    <span className={style.text}>Yêu cầu rút tiền</span>
                    {requireTakeMoney && (
                        <span className={style.btn} onClick={() => handleDelReqTakeMoney()}>
                            {DELETE}
                        </span>
                    )}
                </div>
                <div className={style.content}>
                    <div className={style.txt}>
                        {requireTakeMoney && <div>Tiền muốn rút: {formatMoney(requireTakeMoney.amount)}</div>}
                    </div>
                    <div className={style.btn} onClick={() => handleOpenRequireTakeMoney()}>
                        {textBtn}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Overview);
