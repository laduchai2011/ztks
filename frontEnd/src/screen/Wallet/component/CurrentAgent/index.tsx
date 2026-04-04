import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { formatMoney } from '@src/utility/string';
// import { WalletField } from '@src/dataStruct/wallet';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { AgentField, AgentPayField } from '@src/dataStruct/agent';
import { WalletField } from '@src/dataStruct/wallet';
import {
    useLazyGetAgentWithAgentAccountIdQuery,
    useCreateAgentPayMutation,
    useLazyGetLastAgentPayQuery,
} from '@src/redux/query/agentRTK';
import { usePayAgentFromWalletMutation } from '@src/redux/query/walletRTK';
import { PAY } from '@src/const/text';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';

const CurrentAgent: FC<{
    wallet: WalletField;
    setWallet: React.Dispatch<React.SetStateAction<WalletField | undefined>>;
}> = ({ wallet, setWallet }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );

    const [agent, setAgent] = useState<AgentField | null>(null);
    const [counter, setCounter] = useState<number | null>(null);
    const [agentPay, setAgentPay] = useState<AgentPayField | undefined>(undefined);

    const [getAgentWithAgentAccountId] = useLazyGetAgentWithAgentAccountIdQuery();
    const [payAgentFromWallet] = usePayAgentFromWalletMutation();
    const [createAgentPay] = useCreateAgentPayMutation();
    const [getLastAgentPay] = useLazyGetLastAgentPayQuery();

    useEffect(() => {
        if (!account) return;
        getAgentWithAgentAccountId({ agentAccountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setAgent(resData.data);
                }
            })
            .catch((err) => console.error(err));
    }, [getAgentWithAgentAccountId, account]);

    const handlePay = () => {
        if (!account) return;
        if (!agent) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Bạn không ở trong 1 agent nào !',
                })
            );
            return;
        }
        if (!counter) {
            dispatch(set_isLoading(true));
            getLastAgentPay({ agentId: agent.id, accountId: accountInformation?.addedById || -1 })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        setAgentPay(resData.data);
                        dispatch(
                            setData_toastMessage({
                                type: messageType_enum.ERROR,
                                message: 'Lấy apent-pay thành công !',
                            })
                        );
                    }
                })
                .catch((err) => {
                    console.error(err);
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Đã có lỗi xảy ra !',
                        })
                    );
                })
                .finally(() => {
                    dispatch(set_isLoading(false));
                });
            setCounter(2);
            return;
        } else {
            if (counter > 1) {
                if (!agentPay) {
                    dispatch(set_isLoading(true));
                    createAgentPay({ agentId: agent.id, accountId: accountInformation?.addedById || -1 })
                        .then((res) => {
                            const resData = res.data;
                            if (resData?.isSuccess && resData.data) {
                                setAgentPay(resData.data);
                                dispatch(
                                    setData_toastMessage({
                                        type: messageType_enum.SUCCESS,
                                        message: 'Tạo Agent-Pay thành công !',
                                    })
                                );
                            } else {
                                dispatch(
                                    setData_toastMessage({
                                        type: messageType_enum.ERROR,
                                        message: 'Tạo Agent-Pay không thành công !',
                                    })
                                );
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            dispatch(
                                setData_toastMessage({
                                    type: messageType_enum.ERROR,
                                    message: 'Đã có lỗi xảy ra !',
                                })
                            );
                        })
                        .finally(() => {
                            dispatch(set_isLoading(false));
                        });
                }
                setCounter(counter - 1);
                return;
            }

            if (wallet.amount < 50000) {
                setCounter(null);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Số dư không đủ !',
                    })
                );
                return;
            }

            if (!agentPay) {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Chưa tồn tại 1 agent-pay !',
                    })
                );
                return;
            }

            setCounter(null);
            dispatch(set_isLoading(true));
            payAgentFromWallet({ walletId: wallet.id, agentPayId: agentPay.id, accountId: account.id })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        setWallet(resData.data);
                        dispatch(
                            setData_toastMessage({
                                type: messageType_enum.SUCCESS,
                                message: 'Thanh toán thành công !',
                            })
                        );
                    } else {
                        dispatch(
                            setData_toastMessage({
                                type: messageType_enum.ERROR,
                                message: 'Thanh toán không thành công !',
                            })
                        );
                    }
                })
                .catch((err) => {
                    console.error(err);
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Đã có lỗi xảy ra !',
                        })
                    );
                })
                .finally(() => {
                    dispatch(set_isLoading(false));
                    setAgentPay(undefined);
                });
        }
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div>Dịch vụ hiện tại</div>
                <div>
                    {agent && <div className={style.co}>Có</div>}
                    {!agent && <div className={style.ko}>Không</div>}
                </div>
                <div>
                    <div onClick={() => handlePay()}>
                        <div>{PAY}</div>
                        <div>{formatMoney(50000)}</div>
                    </div>
                </div>
            </div>
            {counter && <div className={style.note}>{`Ấn thêm ${counter} lần nữa để thanh toán`}</div>}
        </div>
    );
};

export default memo(CurrentAgent);
