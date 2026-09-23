import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { BASIC, UPGRADE, DELETE } from '@src/const/text';
import { avatarnull } from '@src/utility/string';
import { IoMdAdd } from 'react-icons/io';
import { Account_Field } from '@src/data_struct/account';
import { Agent_Field, Agent_Pay_Field } from '@src/data_struct/agent';
import { set__is_show__member_list_dialog, set__agent__member_list_dialog } from '@src/redux/slice/Manage_Agent';
import { useLazy_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import {
    set__is_loading,
    set__data__toast_message,
    set__is_show__agent_pay_dialog,
    set__agent__agent_pay_dialog,
} from '@src/redux/slice/Manage_Agent';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { use_agent_Del_Account_Mutation, useLazy_get_Agent_With_Id_Query } from '@src/redux/query/agent_RTK';
import { get_Socket } from '@src/socketIo';
import { handleSrcImage } from '@src/utility/string';

const OneService: FC<{ index: number; data: Agent_Field }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [account, set__account] = useState<Account_Field | undefined>(undefined);
    const is_show__member_list_dialog: boolean = useSelector(
        (state: RootState) => state.Manage_Agent_Slice.member_list_dialog.is_show
    );
    const agent__member_list_dialog: Agent_Field | undefined = useSelector(
        (state: RootState) => state.Manage_Agent_Slice.member_list_dialog.agent
    );
    const [agent, set__agent] = useState<Agent_Field>(data);
    const [text, set__text] = useState<string>('');

    const [agent_Del_Account] = use_agent_Del_Account_Mutation();
    const [get_Account_With_Id] = useLazy_get_Account_With_Id_Query();
    const [get_Agent_With_Id] = useLazy_get_Agent_With_Id_Query();

    const avatar_url = account?.avatar ? handleSrcImage(account.avatar) : avatarnull;

    useEffect(() => {
        const socket = get_Socket();

        const on_Socket_Agent_Pay = (agent_pay: Agent_Pay_Field) => {
            const agent_id = agent_pay.agent_id;

            if (data.id === agent_id) {
                get_Agent_With_Id({ id: agent_id })
                    .then((res) => {
                        const res_data = res.data;
                        if (res_data?.is_success && res_data.data) {
                            const agent_updated = res_data.data;
                            dispatch(set__agent__agent_pay_dialog(agent_updated));
                            set__agent(agent_updated);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        };

        socket.on('agentPay', on_Socket_Agent_Pay);

        return () => {
            socket.off('agentPay', on_Socket_Agent_Pay);
        };
    }, [dispatch, data, get_Agent_With_Id]);

    useEffect(() => {
        if (is_show__member_list_dialog) return;
        if (!agent__member_list_dialog) return;

        if (agent.id === agent__member_list_dialog.id) {
            if (!agent__member_list_dialog.agent_account_id) return;
            get_Account_With_Id({ id: agent__member_list_dialog.agent_account_id })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        set__account(res_data.data);
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
                .finally(() => dispatch(set__is_loading(false)));
        }
    }, [is_show__member_list_dialog, agent__member_list_dialog, get_Account_With_Id, dispatch, agent]);

    useEffect(() => {
        if (!agent.agent_account_id) return;
        get_Account_With_Id({ id: agent.agent_account_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__account(res_data.data);
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
            .finally(() => dispatch(set__is_loading(false)));
    }, [dispatch, agent, get_Account_With_Id]);

    const handle_Add_Agent = () => {
        dispatch(set__is_show__member_list_dialog(true));
        dispatch(set__agent__member_list_dialog(agent));
    };

    const handle_Open_Upgrade = () => {
        dispatch(set__is_show__agent_pay_dialog(true));
        dispatch(set__agent__agent_pay_dialog(agent));
    };

    const handle_Del_Agent = () => {
        dispatch(set__is_loading(true));
        agent_Del_Account({ id: agent.id, account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__account(undefined);
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Xóa thành công !',
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
            .finally(() => dispatch(set__is_loading(false)));
    };

    useEffect(() => {
        const type = agent.type;
        if (type === 'basic') {
            set__text('Bạn đang dùng gói cơ bản, giới hạn 30 tin nhắn trong ngày');
        }
        if (type === 'upgrade') {
            set__text('Bạn đang dùng gói nâng cấp, số lượng tin nhắn không giới hạn');
        }
    }, [agent]);

    const handle_Expiry_Time = () => {
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
                    {agent.type === 'basic' && <div onClick={() => handle_Open_Upgrade()}>{UPGRADE}</div>}
                    {/* <IoIosMore size={25} /> */}
                </div>
            </div>
            <div className={style.content}>
                <div>{text}</div>
            </div>
            {agent?.expiry && <div className={style.expiry}>{handle_Expiry_Time()}</div>}
            {account && (
                <div className={style.infor}>
                    <div>
                        <img src={avatar_url} alt="avatar" />
                        <div>{`${account.first_name} ${account.last_name}`}</div>
                    </div>
                    <div>
                        <button onClick={() => handle_Del_Agent()}>{DELETE}</button>
                    </div>
                </div>
            )}
            {!account && (
                <div className={style.add}>
                    <IoMdAdd onClick={() => handle_Add_Agent()} size={30} />
                </div>
            )}
            <div className={style.btn}>
                <div>Hủy dịch vụ</div>
            </div>
        </div>
    );
};

export default memo(OneService);
