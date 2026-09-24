import { FC, memo, useEffect, useState, useRef, useCallback } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { useNavigate } from 'react-router-dom';
import { route_enum } from '@src/router/type';
import { Chat_Room_Role_Schema } from '@src/data_struct/chat_room';
import { Message_V1_Field, New_Message_V1_Field, Call_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type, Zalo_Call_Type } from '@src/data_struct/zalo/hook_data';
import { Zalo_Oa_Field, Zalo_App_Field } from '@src/data_struct/zalo';
import { Zalo_User_Field } from '@src/data_struct/zalo/user';
import { Account_Field } from '@src/data_struct/account';
import {
    useLazy_get_Last_Message_Query,
    useLazy_get_All_New_Messages_Query,
    // useLazy_get_Message_With_Id_Query,
} from '@src/redux/query/message_v1_RTK';
import { use_get_Zalo_User_Query } from '@src/redux/query/zalo_RTK';
import { use_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import { timeAgoSmart } from '@src/utility/time';
import { handleNewMsgAmount } from './handle';
import { get_Socket } from '@src/socketIo';
import { Socket_Message_Field } from '@src/data_struct/message_v1';
import { avatarnull } from '@src/utility/string';

const ARoom: FC<{ chat_room_role_schema: Chat_Room_Role_Schema }> = ({ chat_room_role_schema }) => {
    const navigate = useNavigate();
    const read_element = useRef<HTMLDivElement | null>(null);
    const send_element = useRef<HTMLDivElement | null>(null);

    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector(
        (state: RootState) => state.Support_Room_Slice.selected_oa
    );
    const chat_room_role: Chat_Room_Role_Schema = chat_room_role_schema;
    const [last_message, set__last_message] = useState<
        Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type> | undefined
    >(undefined);

    const [zalo_user, set__zalo_user] = useState<Zalo_User_Field | undefined>(undefined);
    const [account_WId, set__account_WId] = useState<Account_Field | undefined>(undefined);
    const [new_message, set__new_message] = useState<New_Message_V1_Field<Zalo_Message_Type>[]>([]);

    const [get_Last_Message] = useLazy_get_Last_Message_Query();
    // const [get_Message_With_Id] = useLazy_get_Message_With_Id_Query();
    const [get_All_New_Messages] = useLazy_get_All_New_Messages_Query();

    const handle_Get_All_New_Messages = useCallback(
        (chat_room_id: string) => {
            get_All_New_Messages({ chat_room_id: chat_room_id })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        set__new_message(res_data.data);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        [get_All_New_Messages]
    );

    useEffect(() => {
        const chat_room_id = chat_room_role_schema.chat_room_id;
        handle_Get_All_New_Messages(chat_room_id);
        get_Last_Message({ chat_room_id: chat_room_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__last_message(res_data.data);
                }
            })
            .catch((err) => console.error(err));
    }, [chat_room_role_schema, handle_Get_All_New_Messages, get_Last_Message]);

    useEffect(() => {
        const socket = get_Socket();
        const chat_room_id = chat_room_role_schema.chat_room_id;

        const on_Socket_Message = (socket_msg: Socket_Message_Field) => {
            if (socket_msg.chat_room_id !== chat_room_id) return;
            handle_Get_All_New_Messages(chat_room_id);
            get_Last_Message({ chat_room_id: chat_room_id })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        set__last_message(res_data.data);
                    }
                })
                .catch((err) => console.error(err));
        };

        socket.on('socketMessageAllRoom', on_Socket_Message);

        return () => {
            socket.off('socketMessageAllRoom', on_Socket_Message);
        };
    }, [chat_room_role_schema.chat_room_id, get_Last_Message, handle_Get_All_New_Messages]);

    const {
        data: data__zalo_user,
        // isFetching,
        isLoading: is_loading__zalo_user,
        isError: is_error__zalo_user,
        error: error__zalo_user,
    } = use_get_Zalo_User_Query(
        { zalo_app: zalo_app!, zalo_oa: selected_oa!, user_id_by_app: last_message?.user_id_by_app || '' },
        { skip: zalo_app === undefined || selected_oa === undefined || last_message === undefined }
    );
    useEffect(() => {
        if (is_error__zalo_user && error__zalo_user) {
            console.error(error__zalo_user);
        }
    }, [is_error__zalo_user, error__zalo_user]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [is_loading__zalo_user]);
    useEffect(() => {
        const res_data = data__zalo_user;
        if (res_data?.is_success && res_data.data) {
            set__zalo_user(res_data.data);
        }
    }, [data__zalo_user]);

    const {
        data: data__account_wid,
        // isFetching,
        isLoading: is_loading__account_wid,
        isError: is_error__account_wid,
        error: error__account_wid,
    } = use_get_Account_With_Id_Query({ id: chat_room_role?.account_id || '' }, { skip: chat_room_role === undefined });
    useEffect(() => {
        if (is_error__account_wid && error__account_wid) {
            console.error(error__account_wid);
        }
    }, [is_error__account_wid, error__account_wid]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_account));
    }, [is_loading__account_wid]);
    useEffect(() => {
        const res_data = data__account_wid;
        if (res_data?.is_success && res_data.data) {
            set__account_WId(res_data.data);
        }
    }, [data__account_wid]);

    useEffect(() => {
        if (!read_element.current || !send_element.current) return;
        const readElement = read_element.current;
        const sendElement = send_element.current;

        const is_read = chat_room_role.is_read;
        const is_send = chat_room_role.is_send;

        if (is_read) {
            readElement.classList.add(style.pass);
        }

        if (is_send) {
            sendElement.classList.add(style.pass);
        }
    }, [chat_room_role]);

    useEffect(() => {
        const chat_room_id = chat_room_role.chat_room_id;
        get_All_New_Messages({ chat_room_id: chat_room_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__new_message(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [chat_room_role, get_All_New_Messages]);

    const handle_Goto_Message1 = () => {
        navigate(route_enum.MESSAGE1 + '/' + `${chat_room_role.chat_room_id}`);
    };

    return (
        <div className={style.parent} onClick={() => handle_Goto_Message1()}>
            <div className={style.avatarContainer}>
                <img src={zalo_user?.data.avatar || avatarnull} alt="avatar" />
            </div>
            <div className={style.contentContainer}>
                <div className={style.nameContainer}>
                    <div className={style.name}>{zalo_user?.data.display_name}</div>
                </div>
                <div className={style.inforContainer}>
                    <div className={style.infor}>
                        <div>{`${account_WId?.first_name} ${account_WId?.last_name}`}</div>
                    </div>
                    <div className={style.infor}>
                        <div className={`${style.role} ${style.read}`} ref={read_element}>
                            Đọc
                        </div>
                        <div className={`${style.role} ${style.send}`} ref={send_element}>
                            Gửi
                        </div>
                    </div>
                    <div className={style.infor}>
                        {new_message.length === 0 && last_message && (
                            <div className={style.time}>{timeAgoSmart(last_message.timestamp)}</div>
                        )}
                        {new_message.length > 0 && (
                            <div className={style.newMsgAmount}>{handleNewMsgAmount(new_message.length)}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ARoom);
