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
import {
    ZaloMessageType,
    MessageTextField,
    MessageImageField,
    MessageMultiImageField,
    MessageVideoField,
    MessageAudioField,
    MessageFileField,
    MessageStickerField,
} from '@src/dataStruct/zalo/hookData';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { AccountField } from '@src/dataStruct/account';
import { ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import { Zalo_Event_Name_Enum } from '@src/dataStruct/zalo/hookData/common';
import { timeAgoSmart } from '@src/utility/time';
import { useGetChatRoomRoleWithCridAaidQuery } from '@src/redux/query/chatRoomRTK';
import { useGetAccountWithIdQuery } from '@src/redux/query/accountRTK';
import { set_repliedMessage } from '@src/redux/slice/MessageV1';
import { avatarnull } from '@src/utility/string';

const MyMsg: FC<{
    msgList_element?: HTMLDivElement | null;
    data: MessageV1Field<ZaloMessageType>;
    messages: MessageV1Field<ZaloMessageType>[];
}> = ({ msgList_element, data, messages }) => {
    const dispatch = useDispatch<AppDispatch>();
    const defaultColor = '#EBEBEB';
    const parent_element = useRef<HTMLDivElement | null>(null);
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const { id } = useParams<{ id: string }>();
    const [isMore, setIsMore] = useState<boolean>(false);
    const [chatRoomRole, setChatRoomRole] = useState<ChatRoomRoleField | undefined>(undefined);
    const isYou = data?.reply_account_id === account?.id;
    const youString: string | null = isYou ? 'Bạn' : null;
    const [accountWId, setAccountWId] = useState<AccountField | undefined>(undefined);
    const [isAvatar, setIsAvatar] = useState<boolean>(true);
    const avatarUrl = accountWId?.avatar || avatarnull;

    useEffect(() => {
        // const isUserSend_data = eventName.startsWith('user_send');
        // const isOaSend = eventName.startsWith('oa_send');
        const indexMessage = messages.indexOf(data);
        if (indexMessage <= 0) return;
        const befor_message = messages[indexMessage - 1];
        const isOaSend_dataBefor = befor_message.event_name.startsWith('oa_send');
        if (isOaSend_dataBefor) {
            if (befor_message.reply_account_id === data.reply_account_id) {
                setIsAvatar(false);
            } else {
                setIsAvatar(true);
            }
        } else {
            setIsAvatar(true);
        }
    }, [data, messages]);

    const handleShowMore = () => {
        setIsMore(!isMore);
    };

    const msg = () => {
        const event_name = data.event_name;

        switch (event_name) {
            case Zalo_Event_Name_Enum.oa_send_text: {
                const data_t = data as MessageV1Field<MessageTextField>;
                return <MsgText data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_image: {
                const data_t = data as MessageV1Field<MessageImageField | MessageMultiImageField>;
                return <MsgImage data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_video: {
                const data_t = data as MessageV1Field<MessageVideoField>;
                return <MsgVideo msgList_element={msgList_element} data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_audio: {
                const data_t = data as MessageV1Field<MessageAudioField>;
                return <MsgAudio data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_file: {
                const data_t = data as MessageV1Field<MessageFileField>;
                return <MsgFile data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_sticker: {
                const data_t = data as MessageV1Field<MessageStickerField>;
                return <MsgSticker data={data_t} />;
            }
            default: {
                return;
            }
        }
    };

    const {
        data: data_chatRoomRole,
        // isFetching,
        isLoading: isLoading_chatRoomRole,
        isError: isError_chatRoomRole,
        error: error_chatRoomRole,
    } = useGetChatRoomRoleWithCridAaidQuery(
        { authorizedAccountId: data?.reply_account_id || -1, chatRoomId: Number(id) },
        { skip: id === undefined || data === undefined }
    );
    useEffect(() => {
        if (isError_chatRoomRole && error_chatRoomRole) {
            console.error(error_chatRoomRole);
            // dispatch(
            //     setData_toastMessage({
            //         type: messageType_enum.ERROR,
            //         message: 'Lấy dữ liệu phòng hội thoại KHÔNG thành công !',
            //     })
            // );
        }
    }, [isError_chatRoomRole, error_chatRoomRole]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [isLoading_chatRoomRole]);
    useEffect(() => {
        const resData = data_chatRoomRole;
        if (resData?.isSuccess && resData.data) {
            setChatRoomRole(resData.data);
        }
    }, [data_chatRoomRole]);

    const {
        data: data_account_wid,
        // isFetching,
        isLoading: isLoading_account_wid,
        isError: isError_account_wid,
        error: error_account_wid,
    } = useGetAccountWithIdQuery({ id: data?.reply_account_id || -1 }, { skip: data === undefined });
    useEffect(() => {
        if (isError_account_wid && error_account_wid) {
            console.error(error_account_wid);
        }
    }, [isError_account_wid, error_account_wid]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_account));
    }, [isLoading_account_wid]);
    useEffect(() => {
        const resData = data_account_wid;
        if (resData?.isSuccess && resData.data) {
            setAccountWId(resData.data);
        }
    }, [data_account_wid]);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;
        const background = chatRoomRole?.backGroundColor ? chatRoomRole?.backGroundColor : defaultColor;
        parentElement.style.setProperty('--msgBackground', `${background}`);
    }, [chatRoomRole]);

    const handleToReply = () => {
        dispatch(set_repliedMessage(data));
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.iconContainer}>
                <IoIosMore onClick={() => handleShowMore()} size={25} />
                {isMore && (
                    <div className={style.moreContainer}>
                        <div onClick={() => handleToReply()}>Trả lời</div>
                        <div>Chia sẻ</div>
                    </div>
                )}
            </div>
            <div className={style.msgContainer}>
                {!isYou && (
                    <div className={style.nameContainer}>
                        {youString && <div className={style.youString}>{`(${youString})`}</div>}
                        {isAvatar && (
                            <div className={style.name}>{accountWId?.firstName + ' ' + accountWId?.lastName}</div>
                        )}
                    </div>
                )}
                <div>{msg()}</div>
                <div className={style.moreInfor}>{timeAgoSmart(data.timestamp)}</div>
            </div>
            {!isYou && <div className={style.avatarContainer}>{isAvatar && <img src={avatarUrl} alt="avatar" />}</div>}
        </div>
    );
};

export default memo(MyMsg);
