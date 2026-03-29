import { FC, memo, useEffect, useState, useCallback } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { useNavigate } from 'react-router-dom';
import { route_enum } from '@src/router/type';
import { ChatRoomRoleSchema } from '@src/dataStruct/chatRoom';
import { MessageV1Field, NewMessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloOaField, ZaloAppField } from '@src/dataStruct/zalo';
import { ZaloUserField } from '@src/dataStruct/zalo/user';
import { AccountField } from '@src/dataStruct/account';
import {
    useLazyGetLastMessageQuery,
    useLazyGetAllNewMessagesQuery,
    useLazyGetMessageWithIdQuery,
} from '@src/redux/query/messageV1RTK';
import { useGetZaloUserQuery } from '@src/redux/query/zaloRTK';
import { timeAgoSmart } from '@src/utility/time';
import { MEMBER, YOU, USER, OA, IMAGE, VIDEO, FILE, STICKER, AUDIO } from '@src/const/text';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { Zalo_Event_Name_Enum } from '@src/dataStruct/zalo/hookData/common';
import { handleNewMsgAmount } from './handle';
import { getSocket } from '@src/socketIo';
import { SocketMessageField } from '@src/dataStruct/message_v1';

const User: FC<{ chatRoomRoleSchema: ChatRoomRoleSchema }> = ({ chatRoomRoleSchema }) => {
    const navigate = useNavigate();
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.Home1Slice.selectedOa);
    // const chatRoomRole: ChatRoomRoleSchema = chatRoomRoleSchema;
    const [lastMessage, setLastMessage] = useState<MessageV1Field<ZaloMessageType> | undefined>(undefined);
    const [zaloUser, setZaloUser] = useState<ZaloUserField | undefined>(undefined);
    const isUserSend = lastMessage?.event_name.startsWith('user_send');
    const isOaSend = lastMessage?.event_name.startsWith('oa_send');
    const [note, setNote] = useState<string>('');
    const [member, setMember] = useState<string>('');
    const [newMessage, setNewMessage] = useState<NewMessageV1Field<ZaloMessageType>[]>([]);

    const [getLastMessage] = useLazyGetLastMessageQuery();
    const [getMessageWithId] = useLazyGetMessageWithIdQuery();
    const [getAllNewMessages] = useLazyGetAllNewMessagesQuery();

    const handleGetAllNewMessages = useCallback(
        (chatRoomId: number) => {
            getAllNewMessages({ chatRoomId: chatRoomId.toString() })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        setNewMessage(resData.data);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        [getAllNewMessages]
    );

    useEffect(() => {
        const chatRoomId = chatRoomRoleSchema.chat_room_id;
        handleGetAllNewMessages(chatRoomId);
        getLastMessage({ chatRoomId: chatRoomId.toString() })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setLastMessage(resData.data);
                }
            })
            .catch((err) => console.error(err));
    }, [chatRoomRoleSchema, handleGetAllNewMessages, getLastMessage]);

    useEffect(() => {
        const socket = getSocket();
        const chatRoomId = chatRoomRoleSchema.chat_room_id;

        const onSocketMessage = (socketMsg: SocketMessageField) => {
            if (socketMsg.chatRoomId !== chatRoomId) return;
            handleGetAllNewMessages(chatRoomId);
            getLastMessage({ chatRoomId: chatRoomId.toString() })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        setLastMessage(resData.data);
                    }
                })
                .catch((err) => console.error(err));
        };

        socket.on('socketMessageAllRoom', onSocketMessage);

        return () => {
            socket.off('socketMessageAllRoom', onSocketMessage);
        };
    }, [chatRoomRoleSchema.chat_room_id, getMessageWithId, getLastMessage, handleGetAllNewMessages]);

    const {
        data: data_zaloUser,
        // isFetching,
        isLoading: isLoading_zaloUser,
        isError: isError_zaloUser,
        error: error_zaloUser,
    } = useGetZaloUserQuery(
        { zaloApp: zaloApp!, zaloOa: selectedOa!, userIdByApp: lastMessage?.user_id_by_app || '' },
        { skip: zaloApp === undefined || selectedOa === undefined || lastMessage === undefined }
    );
    useEffect(() => {
        if (isError_zaloUser && error_zaloUser) {
            console.error(error_zaloUser);
        }
    }, [isError_zaloUser, error_zaloUser]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [isLoading_zaloUser]);
    useEffect(() => {
        const resData = data_zaloUser;
        if (resData?.isSuccess && resData.data && resData.data) {
            setZaloUser(resData.data);
        }
    }, [data_zaloUser]);

    useEffect(() => {
        if (!lastMessage) return;

        if (account?.id === lastMessage?.reply_account_id) {
            setMember(YOU);
        } else {
            setMember(MEMBER);
        }

        const msg = () => {
            const event_name = lastMessage.event_name;

            switch (event_name) {
                case Zalo_Event_Name_Enum.user_send_text: {
                    setNote(lastMessage.message.text || '');
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_image: {
                    setNote(IMAGE);
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_video: {
                    setNote(VIDEO);
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_audio: {
                    setNote(AUDIO);
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_file: {
                    setNote(FILE);
                    break;
                }
                case Zalo_Event_Name_Enum.user_send_sticker: {
                    setNote(STICKER);
                    break;
                }
                // case Zalo_Event_Name_Enum.user_send_link: {
                // }
                case Zalo_Event_Name_Enum.oa_send_text: {
                    setNote(lastMessage.message.text || '');
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_image: {
                    setNote(IMAGE);
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_video: {
                    setNote(VIDEO);
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_audio: {
                    setNote(AUDIO);
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_file: {
                    setNote(FILE);
                    break;
                }
                case Zalo_Event_Name_Enum.oa_send_sticker: {
                    setNote(STICKER);
                    break;
                }
                // case Zalo_Event_Name_Enum.user_send_link: {
                // }
                default: {
                    break;
                }
            }
        };

        msg();
    }, [lastMessage, account?.id]);

    const handleGotoMessage1 = () => {
        navigate(route_enum.MESSAGE1 + '/' + `${chatRoomRoleSchema.chat_room_id}`);
    };

    return (
        <div className={style.parent} onClick={() => handleGotoMessage1()}>
            <div className={style.avatarContainer}>
                <img src={zaloUser?.data.avatar} alt="avatar" />
            </div>
            <div className={style.inforContainer}>
                <div className={style.infor}>
                    <div className={style.name}>{zaloUser?.data.display_name}</div>
                    <div className={style.note}>
                        <div>
                            {isUserSend && <div>{`${USER}:`}</div>}
                            {isOaSend && <div>{`${OA}:`}</div>}
                        </div>
                        {isOaSend && <div>{`${member}:`}</div>}
                        <div>{note}</div>
                    </div>
                </div>
                {newMessage.length === 0 && lastMessage && (
                    <div className={style.time}>{timeAgoSmart(lastMessage.timestamp)}</div>
                )}
                {newMessage.length > 0 && (
                    <div className={style.newMsgAmount}>{handleNewMsgAmount(newMessage.length)}</div>
                )}
            </div>
            <div></div>
        </div>
    );
};

export default memo(User);
// export default memo(User, (prev, next) => prev.chatRoomRoleSchema === next.chatRoomRoleSchema);
