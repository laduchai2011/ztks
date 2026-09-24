import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { formatMoney } from '@src/utility/string';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';
import { Agent_Field, Agent_Pay_Field } from '@src/data_struct/agent';
import { Wallet_Field } from '@src/data_struct/wallet';
import {
    useLazy_get_Agent_With_Agent_Account_Id_Query,
    use_create_Agent_Pay_Mutation,
    useLazy_get_Last_Agent_Pay_Query,
} from '@src/redux/query/agent_RTK';
import { use_pay_Agent_From_Wallet_Mutation } from '@src/redux/query/wallet_RTK';
import { PAY } from '@src/const/text';
import { set__is_loading, set__data__toast_message } from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';

const CurrentAgent: FC<{
    wallet: Wallet_Field;
    set__wallet: React.Dispatch<React.SetStateAction<Wallet_Field | undefined>>;
}> = ({ wallet, set__wallet }) => {
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const [agent, set__agent] = useState<Agent_Field | null>(null);
    const [counter, set__counter] = useState<number | null>(null);
    const [agent_pay, set__agent_pay] = useState<Agent_Pay_Field | undefined>(undefined);

    const [get_Agent_With_Agent_Account_Id] = useLazy_get_Agent_With_Agent_Account_Id_Query();
    const [pay_Agent_From_Wallet] = use_pay_Agent_From_Wallet_Mutation();
    const [create_Agent_Pay] = use_create_Agent_Pay_Mutation();
    const [get_Last_Agent_Pay] = useLazy_get_Last_Agent_Pay_Query();

    useEffect(() => {
        if (!account) return;
        get_Agent_With_Agent_Account_Id({ agent_account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__agent(res_data.data);
                }
            })
            .catch((err) => console.error(err));
    }, [get_Agent_With_Agent_Account_Id, account]);

    const handle_Pay = () => {
        if (!account) return;
        if (!agent) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Bạn không ở trong 1 agent nào !',
                })
            );
            return;
        }
        if (!counter) {
            dispatch(set__is_loading(true));
            get_Last_Agent_Pay({ agent_id: agent.id, account_id: account_information?.added_by_id || '' }, false)
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        const new_agent_pay = res_data.data;
                        if (!new_agent_pay.is_pay) {
                            set__agent_pay(res_data.data);
                            dispatch(
                                set__data__toast_message({
                                    type: messageType_enum.SUCCESS,
                                    message: 'Lấy apent-pay thành công !',
                                })
                            );
                        }
                    }
                })
                .catch((err) => {
                    console.error(err);
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Đã có lỗi xảy ra !',
                        })
                    );
                })
                .finally(() => {
                    dispatch(set__is_loading(false));
                });
            set__counter(2);
            return;
        } else {
            if (counter > 1) {
                if (!agent_pay) {
                    dispatch(set__is_loading(true));
                    create_Agent_Pay({ agent_id: agent.id, account_id: account_information?.added_by_id || '' })
                        .then((res) => {
                            const res_data = res.data;
                            if (res_data?.is_success && res_data.data) {
                                set__agent_pay(res_data.data);
                                dispatch(
                                    set__data__toast_message({
                                        type: messageType_enum.SUCCESS,
                                        message: 'Tạo Agent-Pay thành công !',
                                    })
                                );
                            } else {
                                dispatch(
                                    set__data__toast_message({
                                        type: messageType_enum.ERROR,
                                        message: 'Tạo Agent-Pay không thành công !',
                                    })
                                );
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            dispatch(
                                set__data__toast_message({
                                    type: messageType_enum.ERROR,
                                    message: 'Đã có lỗi xảy ra !',
                                })
                            );
                        })
                        .finally(() => {
                            dispatch(set__is_loading(false));
                        });
                }
                set__counter(counter - 1);
                return;
            }

            if (wallet.amount < 50000) {
                set__counter(null);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Số dư không đủ !',
                    })
                );
                return;
            }

            if (!agent_pay) {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Chưa tồn tại 1 agent-pay !',
                    })
                );
                return;
            }

            set__counter(null);
            dispatch(set__is_loading(true));
            pay_Agent_From_Wallet({ wallet_id: wallet.id, agent_pay_id: agent_pay.id, account_id: account.id })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        set__wallet(res_data.data);
                        dispatch(
                            set__data__toast_message({
                                type: messageType_enum.SUCCESS,
                                message: 'Thanh toán thành công !',
                            })
                        );
                    } else {
                        dispatch(
                            set__data__toast_message({
                                type: messageType_enum.ERROR,
                                message: 'Thanh toán không thành công !',
                            })
                        );
                    }
                })
                .catch((err) => {
                    console.error(err);
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Đã có lỗi xảy ra !',
                        })
                    );
                })
                .finally(() => {
                    dispatch(set__is_loading(false));
                    set__agent_pay(undefined);
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
                    <div onClick={() => handle_Pay()}>
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
