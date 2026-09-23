import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoIosMore } from 'react-icons/io';
import MsgText from './MsgText';
import MsgImage from './MsgImage';
import MsgVideo from './MsgVideo';
import MsgAudio from './MsgAudio';
import MsgFile from './MsgFile';
import MsgSticker from './MsgSticker';
import MsgLink from './MsgLink';
import MsgCall from './MsgCall';
import {
    Zalo_Message_Type,
    Message_Text_Field,
    Message_Image_Field,
    Message_Multi_Image_Field,
    Message_Video_Field,
    Message_Audio_Field,
    Message_File_Field,
    Message_Sticker_Field,
    Message_Link_Field,
    Zalo_Call_Type,
} from '@src/data_struct/zalo/hook_data';
import { Message_V1_Field, Call_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Zalo_User_Field } from '@src/data_struct/zalo/user';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { Zalo_Event_Name_Enum } from '@src/data_struct/zalo/hook_data/common';
import { timeAgoSmart } from '@src/utility/time';
import { use_get_Zalo_User_Query } from '@src/redux/query/zalo_RTK';
import { set__replied_message } from '@src/redux/slice/Message_V1';
import { avatarnull } from '@src/utility/string';

const UserMsg: FC<{
    msgList_element?: HTMLDivElement | null;
    data: Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type>;
    messages: (Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type>)[];
}> = ({ msgList_element, data, messages }) => {
    const dispatch = useDispatch<AppDispatch>();
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const zalo_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Message_V1_Slice.zalo_oa);
    const chat_room: Chat_Room_Field | undefined = useSelector((state: RootState) => state.Message_V1_Slice.chat_room);

    const [user_id_by_app, set__user_id_by_app] = useState<string | undefined>(undefined);
    const [zalo_user, set__zalo_user] = useState<Zalo_User_Field | undefined>(undefined);
    const [is_avatar, set__is_avatar] = useState<boolean>(true);

    useEffect(() => {
        if (!chat_room) return;
        set__user_id_by_app(chat_room.user_id_by_app);
    }, [chat_room]);

    useEffect(() => {
        // const isUserSend_data = eventName.startsWith('user_send');
        // const isOaSend = eventName.startsWith('oa_send');
        const index_message = messages.indexOf(data);
        if (index_message <= 0) return;
        const befor_message = messages[index_message - 1];
        const is_user_send__data_befor = befor_message.event_name.startsWith('user_send');
        if (is_user_send__data_befor) {
            set__is_avatar(false);
        } else {
            set__is_avatar(true);
        }
    }, [data, messages]);

    const {
        data: data__zalo_user,
        // isFetching,
        isLoading: is_loading__zalo_user,
        isError: is_error__zalo_user,
        error: error__zalo_user,
    } = use_get_Zalo_User_Query(
        { zalo_app: zalo_app!, zalo_oa: zalo_oa!, user_id_by_app: user_id_by_app! },
        { skip: zalo_app === undefined || zalo_oa === undefined || user_id_by_app === undefined }
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

    const [is_more, set__is_more] = useState<boolean>(false);

    const handle_Show_More = () => {
        set__is_more(!is_more);
    };

    const msg = () => {
        const event_name = data.event_name;

        switch (event_name) {
            case Zalo_Event_Name_Enum.user_send_text: {
                const data_t = data as Message_V1_Field<Message_Text_Field>;
                return <MsgText data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_image: {
                const data_t = data as Message_V1_Field<Message_Image_Field | Message_Multi_Image_Field>;
                return <MsgImage data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_video: {
                const data_t = data as Message_V1_Field<Message_Video_Field>;
                return <MsgVideo msgList_element={msgList_element} data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_audio: {
                const data_t = data as Message_V1_Field<Message_Audio_Field>;
                return <MsgAudio data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_file: {
                const data_t = data as Message_V1_Field<Message_File_Field>;
                return <MsgFile data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_sticker: {
                const data_t = data as Message_V1_Field<Message_Sticker_Field>;
                return <MsgSticker data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_link: {
                const data_t = data as Message_V1_Field<Message_Link_Field>;
                return <MsgLink data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_call_oa: {
                const data_t = data as Call_V1_Field<Zalo_Call_Type>;
                return <MsgCall data={data_t} />;
            }
            default: {
                return;
            }
        }
    };

    const handle_To_Reply = () => {
        dispatch(set__replied_message(data));
    };

    return (
        <div className={style.parent}>
            <div className={style.avatarContainer}>
                {is_avatar && <img src={zalo_user?.data.avatar || avatarnull} alt="avatar" />}
            </div>
            <div className={style.msgContainer}>
                {is_avatar && <div className={style.name}>{zalo_user?.data.display_name}</div>}
                <div>{msg()}</div>
                <div className={style.moreInfor}>{timeAgoSmart(data.timestamp)}</div>
            </div>
            <div className={style.iconContainer}>
                <IoIosMore onClick={() => handle_Show_More()} size={25} />
                {is_more && (
                    <div className={style.moreContainer}>
                        <div onClick={() => handle_To_Reply()}>Trả lời</div>
                        <div>Chia sẻ</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(UserMsg);
