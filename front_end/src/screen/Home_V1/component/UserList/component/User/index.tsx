import { FC, memo, useEffect, useState, useCallback } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { useNavigate } from 'react-router-dom';
import { route_enum } from '@src/router/type';
import { Chat_Room_Role_Schema } from '@src/data_struct/chat_room';
import {
    Message_V1_Field,
    New_Message_V1_Field,
    Socket_Message_Field,
    Call_V1_Field,
} from '@src/data_struct/message_v1';
import { Zalo_Oa_Field, Zalo_App_Field } from '@src/data_struct/zalo';
import { Zalo_User_Field } from '@src/data_struct/zalo/user';
import { Account_Field } from '@src/data_struct/account';
import {
    useLazy_get_Last_Message_Query,
    useLazy_get_All_New_Messages_Query,
    useLazy_get_Message_With_Id_Query,
} from '@src/redux/query/message_v1_RTK';
import { use_get_Zalo_User_Query } from '@src/redux/query/zalo_RTK';
import { timeAgoSmart } from '@src/utility/time';
import { MEMBER, YOU, USER, OA, IMAGE, VIDEO, FILE, STICKER, AUDIO, OA_CALL_USER, USER_CALL_OA } from '@src/const/text';
import { Zalo_Message_Type, Zalo_Call_Type } from '@src/data_struct/zalo/hook_data';
import { Zalo_Event_Name_Enum } from '@src/data_struct/zalo/hook_data/common';
import { handleNewMsgAmount } from './handle';
import { get_Socket } from '@src/socketIo';
import { avatarnull } from '@src/utility/string';

const User: FC<{ chat_room_role_schema: Chat_Room_Role_Schema }> = ({ chat_room_role_schema }) => {
    const navigate = useNavigate();
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Home_V1_Slice.selected_oa);

    const [last_message, set__last_message] = useState<
        Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type> | undefined
    >(undefined);
    const [zalo_user, set__zalo_user] = useState<Zalo_User_Field | undefined>(undefined);
    const is_user_send = last_message?.event_name.startsWith('user_send');
    const is_oa_send = last_message?.event_name.startsWith('oa_send');
    const [note, set__note] = useState<string>('');
    const [member, set__member] = useState<string>('');
    const [new_message, set__new_message] = useState<New_Message_V1_Field<Zalo_Message_Type>[]>([]);

    const [get_Last_Message] = useLazy_get_Last_Message_Query();
    const [get_Message_With_Id] = useLazy_get_Message_With_Id_Query();
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
        if (res_data?.is_success && res_data.data && res_data.data) {
            set__zalo_user(res_data.data);
        }
    }, [data__zalo_user]);

    useEffect(() => {
        if (!last_message) return;
        if (account?.id === last_message?.reply_account_id) {
            set__member(YOU);
        } else {
            set__member(MEMBER);
        }

        const msg = () => {
            const event_name = last_message.event_name;

            switch (event_name) {
                case Zalo_Event_Name_Enum.user_send_text: {
                    if (!('call_id' in last_message)) {
                        set__note(last_message?.message.text || '');
                    }
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_image: {
                    set__note(IMAGE);
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_video: {
                    set__note(VIDEO);
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_audio: {
                    set__note(AUDIO);
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_file: {
                    set__note(FILE);
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_sticker: {
                    set__note(STICKER);
                    break;
                }
                // case Zalo_Event_Name_Enum.user_send_link: {
                // }
                case Zalo_Event_Name_Enum.user_call_oa: {
                    set__note(USER_CALL_OA);
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_text: {
                    if (!('call_id' in last_message)) {
                        set__note(last_message?.message.text || '');
                    }
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_image: {
                    set__note(IMAGE);
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_video: {
                    set__note(VIDEO);
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_audio: {
                    set__note(AUDIO);
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_file: {
                    set__note(FILE);
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_sticker: {
                    set__note(STICKER);
                    break;
                }
                // case Zalo_Event_Name_Enum.user_send_link: {
                // }
                case Zalo_Event_Name_Enum.oa_call_user: {
                    set__note(OA_CALL_USER);
                    break;
                }
                default: {
                    break;
                }
            }
        };

        msg();
    }, [last_message, account?.id]);

    const handle_Goto_Message = () => {
        navigate(route_enum.MESSAGE1 + '/' + `${chat_room_role_schema.chat_room_id}`);
    };

    return (
        <div className={style.parent} onClick={() => handle_Goto_Message()}>
            <div className={style.avatarContainer}>
                <img src={zalo_user?.data.avatar || avatarnull} alt="avatar" />
            </div>
            <div className={style.inforContainer}>
                <div className={style.infor}>
                    <div className={style.name}>{zalo_user?.data.display_name}</div>
                    <div className={style.note}>
                        <div>
                            {is_user_send && <div>{`${USER}:`}</div>}
                            {is_oa_send && <div>{`${OA}:`}</div>}
                        </div>
                        {is_oa_send && <div>{`${member}:`}</div>}
                        <div>{note}</div>
                    </div>
                </div>
                {new_message.length === 0 && last_message && (
                    <div className={style.time}>{timeAgoSmart(last_message.timestamp)}</div>
                )}
                {new_message.length > 0 && (
                    <div className={style.newMsgAmount}>{handleNewMsgAmount(new_message.length)}</div>
                )}
            </div>
            <div></div>
        </div>
    );
};

export default memo(User);
