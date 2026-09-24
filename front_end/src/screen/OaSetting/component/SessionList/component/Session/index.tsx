import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { MdDelete } from 'react-icons/md';
import { GoDotFill } from 'react-icons/go';
import { avatarnull } from '@src/utility/string';
import { Chat_Session_Field } from '@src/data_struct/chat_session';
import { use_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_loading, set__data__toast_message, set__is_show__del_dialog } from '@src/redux/slice/Oa_Setting';
import { Account_Field } from '@src/data_struct/account';
import { use_get_All_Members_Query } from '@src/redux/query/account_RTK';
import {
    use_update_Selected_Account_Id_Of_Chat_Session_Mutation,
    use_update_Is_Reay_Of_Chat_Session_Mutation,
} from '@src/redux/query/chat_session_RTK';
import { handleSrcImage } from '@src/utility/string';

const Session: FC<{ index: number; data: Chat_Session_Field }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [chat_session, set__chat_session] = useState<Chat_Session_Field>(data);
    const btn_text = chat_session.is_ready ? 'Bỏ sẵn sàng' : 'Sẵn sàng';
    const ready_color = chat_session.is_ready ? 'greenyellow' : 'gray';
    const ready_background_color = !chat_session.is_ready ? 'greenyellow' : 'white';
    const [all_members, set__all_members] = useState<Account_Field[]>([]);
    const [account, set__account] = useState<Account_Field | undefined>(undefined);

    const [update_Selected_Account_Id_Of_Chat_Session] = use_update_Selected_Account_Id_Of_Chat_Session_Mutation();
    const [update_Is_Ready_Of_Chat_Session] = use_update_Is_Reay_Of_Chat_Session_Mutation();

    const {
        data: data__all_members,
        // isFetching,
        isLoading: is_loading__all_members,
        isError: is_error__all_members,
        error: error__all_members,
    } = use_get_All_Members_Query({ added_by_id: '' });
    useEffect(() => {
        if (is_error__all_members && error__all_members) {
            console.error(error__all_members);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Lấy dữ liệu KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, is_error__all_members, error__all_members]);
    useEffect(() => {
        dispatch(set__is_loading(is_loading__all_members));
    }, [dispatch, is_loading__all_members]);
    useEffect(() => {
        const res_data = data__all_members;
        if (res_data?.is_success && res_data?.data) {
            set__all_members(res_data.data);
        }
    }, [data__all_members]);

    const {
        data: data__account,
        // isFetching,
        isLoading: is_loading_account,
        isError: is_error_account,
        error: error_account,
    } = use_get_Account_With_Id_Query({ id: chat_session.selected_account_id });
    useEffect(() => {
        if (is_error_account && error_account) {
            console.error(error_account);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Lấy dữ liệu tài khoản KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, is_error_account, error_account]);
    useEffect(() => {
        dispatch(set__is_loading(is_loading_account));
    }, [dispatch, is_loading_account]);
    useEffect(() => {
        const res_data = data__account;
        if (res_data?.is_success && res_data.data) {
            set__account(res_data.data);
        }
    }, [dispatch, data__account]);

    const handle_Del = () => {
        dispatch(set__is_show__del_dialog(true));
    };

    const handle_Selected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        dispatch(set__is_loading(true));
        update_Selected_Account_Id_Of_Chat_Session({ id: chat_session.id, selected_account_id: value, account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__chat_session(res_data.data);
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.WARN,
                            message: 'Lựa chọn KHÔNG thành công !',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(set__is_loading(false)));
    };

    const handle_Ready = () => {
        const is_ready = chat_session.is_ready;
        dispatch(set__is_loading(true));
        update_Is_Ready_Of_Chat_Session({ id: chat_session.id, is_ready: !is_ready, account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__chat_session(res_data.data);
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.WARN,
                            message: 'Hành động thất bại !',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(set__is_loading(false)));
    };

    const list_member = all_members.map((item, index) => {
        const index1 = index + 1;
        return (
            <option key={`${item.id}-${chat_session.id}`} value={item.id}>
                {index1 + '  ' + item.first_name + ' ' + item.last_name}
            </option>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>{index}</div>
                <div>{chat_session.label}</div>
                <div>
                    <GoDotFill size={20} color={ready_color} />
                    <MdDelete onClick={() => handle_Del()} size={20} color="red" />
                </div>
            </div>
            <div className={style.infor}>
                <div>{`Mã phiên: ${chat_session.code}`}</div>
                <div>Chỉ định: Lựa chọn hoặc nhập id</div>
                <div className={style.selectedContainer}>
                    <div>
                        <select value={chat_session.selected_account_id} onChange={(e) => handle_Selected(e)}>
                            {list_member}
                        </select>
                    </div>
                    <div>
                        <input placeholder="id" />
                    </div>
                </div>
            </div>
            <div className={style.selectedAcount}>
                <div>
                    <img src={account?.avatar ? handleSrcImage(account.avatar) : avatarnull} alt="avatar" />
                </div>
                <div>{account?.first_name + ' ' + account?.last_name}</div>
            </div>
            <div className={style.btnContainer}>
                <button style={{ background: ready_background_color }} onClick={() => handle_Ready()}>
                    {btn_text}
                </button>
            </div>
        </div>
    );
};

export default memo(Session);
