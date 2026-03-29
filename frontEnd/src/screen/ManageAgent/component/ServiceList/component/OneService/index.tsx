import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { BASIC, UPGRADE, DELETE } from '@src/const/text';
import { avatarnull } from '@src/utility/string';
import { IoMdAdd } from 'react-icons/io';
import { AccountField } from '@src/dataStruct/account';
import { AgentField, AgentPayField } from '@src/dataStruct/agent';
import { setIsShow_memberListDialog, set_agent_memberListDialog } from '@src/redux/slice/ManageAgent';
import { useLazyGetAccountWithIdQuery } from '@src/redux/query/accountRTK';
import {
    set_isLoading,
    setData_toastMessage,
    setIsShow_agentPayDialog,
    set_agent_agentPayDialog,
} from '@src/redux/slice/ManageAgent';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useAgentDelAccountMutation, useLazyGetAgentWithIdQuery } from '@src/redux/query/agentRTK';
import { getSocket } from '@src/socketIo';

const OneService: FC<{ index: number; data: AgentField }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [account, setAccount] = useState<AccountField | undefined>(undefined);
    const iShow_MemberListDialog: boolean = useSelector(
        (state: RootState) => state.ManageAgentSlice.memberListDialog.isShow
    );
    const agent_MemberListDialog: AgentField | undefined = useSelector(
        (state: RootState) => state.ManageAgentSlice.memberListDialog.agent
    );
    const [agent, setAgent] = useState<AgentField>(data);
    const [text, setText] = useState<string>('');

    const [agentDelAccount] = useAgentDelAccountMutation();
    const [getAccountWithId] = useLazyGetAccountWithIdQuery();
    const [getAgentWithId] = useLazyGetAgentWithIdQuery();

    useEffect(() => {
        const socket = getSocket();

        const onSocketAgentPay = (agentPay: AgentPayField) => {
            const agentId = agentPay.agentId;

            if (data.id === agentId) {
                getAgentWithId({ id: agentId })
                    .then((res) => {
                        const resData = res.data;
                        if (resData?.isSuccess && resData.data) {
                            const agentUpdated = resData.data;
                            dispatch(set_agent_agentPayDialog(agentUpdated));
                            setAgent(agentUpdated);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        };

        socket.on('agentPay', onSocketAgentPay);

        return () => {
            socket.off('agentPay', onSocketAgentPay);
        };
    }, [dispatch, data, getAgentWithId]);

    useEffect(() => {
        if (iShow_MemberListDialog) return;
        if (!agent_MemberListDialog) return;

        if (agent.id === agent_MemberListDialog.id) {
            if (!agent_MemberListDialog.agentAccountId) return;
            getAccountWithId({ id: agent_MemberListDialog.agentAccountId })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        setAccount(resData.data);
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
                .finally(() => dispatch(set_isLoading(false)));
        }
    }, [iShow_MemberListDialog, agent_MemberListDialog, getAccountWithId, dispatch, agent]);

    useEffect(() => {
        if (!agent.agentAccountId) return;
        getAccountWithId({ id: agent.agentAccountId })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setAccount(resData.data);
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
            .finally(() => dispatch(set_isLoading(false)));
    }, [dispatch, agent, getAccountWithId]);

    const handleAddAgent = () => {
        dispatch(setIsShow_memberListDialog(true));
        dispatch(set_agent_memberListDialog(agent));
    };

    const handleOpenUpgrade = () => {
        dispatch(setIsShow_agentPayDialog(true));
        dispatch(set_agent_agentPayDialog(agent));
    };

    const handleDelAgent = () => {
        dispatch(set_isLoading(true));
        agentDelAccount({ id: agent.id, accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setAccount(undefined);
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Xóa thành công !',
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
            .finally(() => dispatch(set_isLoading(false)));
    };

    useEffect(() => {
        const type = agent.type;
        if (type === 'basic') {
            setText('Bạn đang dùng gói cơ bản, giới hạn 30 tin nhắn trong ngày');
        }
        if (type === 'upgrade') {
            setText('Bạn đang dùng gói nâng cấp, số lượng tin nhắn không giới hạn');
        }
    }, [agent]);

    const handleExpiryTime = () => {
        const dateStr = agent.expiry;
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>{index + 1}</div>
                <div>
                    {agent.type === 'basic' && <div>{BASIC}</div>}
                    {agent.type === 'basic' && <div onClick={() => handleOpenUpgrade()}>{UPGRADE}</div>}
                    {/* <IoIosMore size={25} /> */}
                </div>
            </div>
            <div className={style.content}>
                <div>{text}</div>
            </div>
            {agent?.expiry && <div className={style.expiry}>{handleExpiryTime()}</div>}
            {account && (
                <div className={style.infor}>
                    <div>
                        <img src={account.avatar ? account.avatar : avatarnull} alt="avatar" />
                        <div>{`${account.firstName} ${account.lastName}`}</div>
                    </div>
                    <div>
                        <button onClick={() => handleDelAgent()}>{DELETE}</button>
                    </div>
                </div>
            )}
            {!account && (
                <div className={style.add}>
                    <IoMdAdd onClick={() => handleAddAgent()} size={30} />
                </div>
            )}
            <div className={style.btn}>
                <div>Hủy dịch vụ</div>
            </div>
        </div>
    );
};

export default memo(OneService);
