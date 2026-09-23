import { FC, memo, useState, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { useParams } from 'react-router-dom';
import { IoIosMore } from 'react-icons/io';
import MsgText from './MsgText';
import MsgImage from './MsgImage';
import MsgVideo from './MsgVideo';
import MsgAudio from './MsgAudio';
import MsgFile from './MsgFile';
import MsgSticker from './MsgSticker';
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
    Zalo_Call_Type,
} from '@src/data_struct/zalo/hook_data';
import { Message_V1_Field, Call_V1_Field } from '@src/data_struct/message_v1';
import { Account_Field } from '@src/data_struct/account';
import { Chat_Room_Role_Field } from '@src/data_struct/chat_room';
import { Zalo_Event_Name_Enum } from '@src/data_struct/zalo/hook_data/common';
import { timeAgoSmart } from '@src/utility/time';
import { use_get_Chat_Room_Role_With_Crid_Aaid_Query } from '@src/redux/query/chat_room_RTK';
import { use_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import { set__replied_message } from '@src/redux/slice/Message_V1';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';

const MyMsg: FC<{
    msgList_element?: HTMLDivElement | null;
    data: Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type>;
    messages: (Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type>)[];
}> = ({ msgList_element, data, messages }) => {
    const dispatch = useDispatch<AppDispatch>();
    const default_color = '#EBEBEB';
    const parent_element = useRef<HTMLDivElement | null>(null);
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const { id } = useParams<{ id: string }>();

    const [is_more, set__is_more] = useState<boolean>(false);
    const [chat_room_role, set__chat_room_role] = useState<Chat_Room_Role_Field | undefined>(undefined);
    const is_you = data?.reply_account_id === account?.id;
    const you_string: string | null = is_you ? 'Bạn' : null;
    const [accountWId, set__accountWId] = useState<Account_Field | undefined>(undefined);
    const [is_avatar, set__is_avatar] = useState<boolean>(true);
    const avatar_url = accountWId?.avatar ? handleSrcImage(accountWId.avatar) : avatarnull;

    useEffect(() => {
        // const isUserSend_data = eventName.startsWith('user_send');
        // const isOaSend = eventName.startsWith('oa_send');
        const index_message = messages.indexOf(data);
        if (index_message <= 0) return;
        const befor_message = messages[index_message - 1];
        const is_oa_send__data_befor = befor_message.event_name.startsWith('oa_send');
        if (is_oa_send__data_befor) {
            if (befor_message.reply_account_id === data.reply_account_id) {
                set__is_avatar(false);
            } else {
                set__is_avatar(true);
            }
        } else {
            set__is_avatar(true);
        }
    }, [data, messages]);

    const handle_Show_More = () => {
        set__is_more(!is_more);
    };

    const msg = () => {
        const event_name = data.event_name;

        switch (event_name) {
            case Zalo_Event_Name_Enum.oa_send_text: {
                const data_t = data as Message_V1_Field<Message_Text_Field>;
                return <MsgText data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_image: {
                const data_t = data as Message_V1_Field<Message_Image_Field | Message_Multi_Image_Field>;
                return <MsgImage data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_video: {
                const data_t = data as Message_V1_Field<Message_Video_Field>;
                return <MsgVideo msgList_element={msgList_element} data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_audio: {
                const data_t = data as Message_V1_Field<Message_Audio_Field>;
                return <MsgAudio data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_file: {
                const data_t = data as Message_V1_Field<Message_File_Field>;
                return <MsgFile data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_sticker: {
                const data_t = data as Message_V1_Field<Message_Sticker_Field>;
                return <MsgSticker data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_call_user: {
                const data_t = data as Call_V1_Field<Zalo_Call_Type>;
                return <MsgCall data={data_t} />;
            }
            default: {
                return;
            }
        }
    };

    const {
        data: data__chat_room_role,
        // isFetching,
        isLoading: is_loading__chat_room_role,
        isError: is_error__chat_room_role,
        error: error__chat_room_role,
    } = use_get_Chat_Room_Role_With_Crid_Aaid_Query(
        { authorized_account_id: data?.reply_account_id || '', chat_room_id: id || '' },
        { skip: id === undefined || data === undefined }
    );
    useEffect(() => {
        if (is_error__chat_room_role && error__chat_room_role) {
            console.error(error__chat_room_role);
        }
    }, [is_error__chat_room_role, error__chat_room_role]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [is_loading__chat_room_role]);
    useEffect(() => {
        const res_data = data__chat_room_role;
        if (res_data?.is_success && res_data.data) {
            set__chat_room_role(res_data.data);
        }
    }, [data__chat_room_role]);

    const {
        data: data__account_wid,
        // isFetching,
        isLoading: is_loading__account_wid,
        isError: is_error__account_wid,
        error: error__account_wid,
    } = use_get_Account_With_Id_Query({ id: data?.reply_account_id || '' }, { skip: data === undefined });
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
            set__accountWId(res_data.data);
        }
    }, [data__account_wid]);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;
        const background = chat_room_role?.back_ground_color ? chat_room_role?.back_ground_color : default_color;
        parentElement.style.setProperty('--msgBackground', `${background}`);
    }, [chat_room_role]);

    const handle_To_Reply = () => {
        set__is_more(!is_more);
        dispatch(set__replied_message(data));
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.iconContainer}>
                <IoIosMore onClick={() => handle_Show_More()} size={25} />
                {is_more && (
                    <div className={style.moreContainer}>
                        <div onClick={() => handle_To_Reply()}>Trả lời</div>
                        <div>Chia sẻ</div>
                    </div>
                )}
            </div>
            <div className={style.msgContainer}>
                {!is_you && (
                    <div className={style.nameContainer}>
                        {you_string && <div className={style.youString}>{`(${you_string})`}</div>}
                        {is_avatar && (
                            <div className={style.name}>{accountWId?.first_name + ' ' + accountWId?.last_name}</div>
                        )}
                    </div>
                )}
                <div>{msg()}</div>
                <div className={style.moreInfor}>{timeAgoSmart(data.timestamp)}</div>
            </div>
            {!is_you && (
                <div className={style.avatarContainer}>{is_avatar && <img src={avatar_url} alt="avatar" />}</div>
            )}
        </div>
    );
};

export default memo(MyMsg);
