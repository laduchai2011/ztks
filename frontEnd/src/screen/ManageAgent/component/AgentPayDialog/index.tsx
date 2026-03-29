import { memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, PAY, CREATE_PAY } from '@src/const/text';
import { AgentField, AgentPayField } from '@src/dataStruct/agent';
import { setIsShow_agentPayDialog, set_isLoading, setData_toastMessage } from '@src/redux/slice/ManageAgent';
import { useLazyGetLastAgentPayQuery, useCreateAgentPayMutation } from '@src/redux/query/agentRTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { formatMoney } from '@src/utility/string';

const AgentPayDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isShow: boolean = useSelector((state: RootState) => state.ManageAgentSlice.agentPayDialog.isShow);
    const agent: AgentField | undefined = useSelector(
        (state: RootState) => state.ManageAgentSlice.agentPayDialog.agent
    );
    const [agentPay, setAgentPay] = useState<AgentPayField | undefined>(undefined);
    const [qrCode, setQrCode] = useState<string>('');
    const moneyAmount = 10000;

    const [getLastAgentPay] = useLazyGetLastAgentPayQuery();
    const [createAgentPay] = useCreateAgentPayMutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
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
    }, [isShow]);

    useEffect(() => {
        if (!agentPay) return;
        const des = `ztksPayjagentPayj${agentPay.id}`;
        setQrCode(`https://qr.sepay.vn/img?acc=VQRQAHJHB9302&bank=MBBank&amount=${moneyAmount}&des=${des}`);
    }, [agentPay]);

    useEffect(() => {
        if (!agent) return;
        if (isShow) {
            dispatch(set_isLoading(true));
            getLastAgentPay({ agentId: agent.id, accountId: -1 })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        setAgentPay(resData.data);
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
        } else {
            setTimeout(() => {
                setAgentPay(undefined);
                setQrCode('');
            }, 500);
        }
    }, [dispatch, agent, getLastAgentPay, isShow]);

    const handleClose = () => {
        dispatch(setIsShow_agentPayDialog(false));
    };

    const handleCreateAgentPay = () => {
        if (!agent) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Chưa xác định được agent !',
                })
            );
            return;
        }

        dispatch(set_isLoading(true));
        createAgentPay({ agentId: agent.id, accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setAgentPay(resData.data);
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Tạo không thành công !',
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
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.header}>
                    <div>{PAY}</div>
                </div>
                {agent?.type !== 'upgrade' && !agentPay?.isPay && (
                    <div className={style.qrContainer}>
                        <div>Quét mã để thanh toán</div>
                        <div>{qrCode.length > 0 && <img src={qrCode} alt="qrCode" />}</div>
                    </div>
                )}
                {agent?.type !== 'upgrade' && !agentPay?.isPay && (
                    <div className={style.contentContainer}>
                        <div>{formatMoney(moneyAmount.toString())}</div>
                    </div>
                )}
                {agent?.type === 'upgrade' && (
                    <div className={style.text}>
                        <div>Bạn đang dùng gói nâng cấp</div>
                    </div>
                )}
                {agent?.type !== 'upgrade' && !agentPay && (
                    <div className={style.btnContainer}>
                        <div onClick={() => handleCreateAgentPay()}>{CREATE_PAY}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(AgentPayDialog);
