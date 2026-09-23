import { memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, PAY, CREATE_PAY } from '@src/const/text';
import { Agent_Field, Agent_Pay_Field } from '@src/data_struct/agent';
import {
    set__is_show__agent_pay_dialog,
    set__is_loading,
    set__data__toast_message,
} from '@src/redux/slice/Manage_Agent';
import { useLazy_get_Last_Agent_Pay_Query, use_create_Agent_Pay_Mutation } from '@src/redux/query/agent_RTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { formatMoney } from '@src/utility/string';

const AgentPayDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const is_show: boolean = useSelector((state: RootState) => state.Manage_Agent_Slice.agent_pay_dialog.is_show);
    const agent: Agent_Field | undefined = useSelector(
        (state: RootState) => state.Manage_Agent_Slice.agent_pay_dialog.agent
    );
    const [agent_pay, set__agent_pay] = useState<Agent_Pay_Field | undefined>(undefined);
    const [qr_code, set__qr_code] = useState<string>('');
    const money_amount = 10000;

    const [get_Last_Agent_Pay] = useLazy_get_Last_Agent_Pay_Query();
    const [create_Agent_Pay] = use_create_Agent_Pay_Mutation();

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

    useEffect(() => {
        if (!agent_pay) return;
        const des = `ztksPayjagentPayj${agent_pay.id}`;
        set__qr_code(`https://qr.sepay.vn/img?acc=VQRQAHJHB9302&bank=MBBank&amount=${money_amount}&des=${des}`);
    }, [agent_pay]);

    useEffect(() => {
        if (!agent) return;
        if (is_show) {
            dispatch(set__is_loading(true));
            get_Last_Agent_Pay({ agent_id: agent.id, account_id: '' })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        set__agent_pay(res_data.data);
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
        } else {
            setTimeout(() => {
                set__agent_pay(undefined);
                set__qr_code('');
            }, 500);
        }
    }, [dispatch, agent, get_Last_Agent_Pay, is_show]);

    const handle_Close = () => {
        dispatch(set__is_show__agent_pay_dialog(false));
    };

    const handle_Create_Agent_Pay = () => {
        if (!agent) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Chưa xác định được agent !',
                })
            );
            return;
        }

        dispatch(set__is_loading(true));
        create_Agent_Pay({ agent_id: agent.id, account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__agent_pay(res_data.data);
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Tạo không thành công !',
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
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.header}>
                    <div>{PAY}</div>
                </div>
                {agent?.type !== 'upgrade' && !agent_pay?.is_pay && (
                    <div className={style.qrContainer}>
                        <div>Quét mã để thanh toán</div>
                        <div>{qr_code.length > 0 && <img src={qr_code} alt="qrCode" />}</div>
                    </div>
                )}
                {agent?.type !== 'upgrade' && !agent_pay?.is_pay && (
                    <div className={style.contentContainer}>
                        <div>{formatMoney(money_amount.toString())}</div>
                    </div>
                )}
                {agent?.type === 'upgrade' && (
                    <div className={style.text}>
                        <div>Bạn đang dùng gói nâng cấp</div>
                    </div>
                )}
                {agent?.type !== 'upgrade' && !agent_pay && (
                    <div className={style.btnContainer}>
                        <div onClick={() => handle_Create_Agent_Pay()}>{CREATE_PAY}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(AgentPayDialog);
