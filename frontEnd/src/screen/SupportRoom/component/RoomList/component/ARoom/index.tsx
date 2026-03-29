import { FC, memo, useEffect, useState, useRef, useCallback } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { useNavigate } from 'react-router-dom';
import { route_enum } from '@src/router/type';
import { ChatRoomRoleSchema } from '@src/dataStruct/chatRoom';
import { MessageV1Field, NewMessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { ZaloOaField, ZaloAppField } from '@src/dataStruct/zalo';
import { ZaloUserField } from '@src/dataStruct/zalo/user';
import { AccountField } from '@src/dataStruct/account';
import {
    useLazyGetLastMessageQuery,
    useLazyGetAllNewMessagesQuery,
    useLazyGetMessageWithIdQuery,
} from '@src/redux/query/messageV1RTK';
import { useGetZaloUserQuery } from '@src/redux/query/zaloRTK';
import { useGetAccountWithIdQuery } from '@src/redux/query/accountRTK';
import { timeAgoSmart } from '@src/utility/time';
import { handleNewMsgAmount } from './handle';
import { getSocket } from '@src/socketIo';
import { SocketMessageField } from '@src/dataStruct/message_v1';

const ARoom: FC<{ chatRoomRoleSchema: ChatRoomRoleSchema }> = ({ chatRoomRoleSchema }) => {
    const navigate = useNavigate();
    const read_element = useRef<HTMLDivElement | null>(null);
    const send_element = useRef<HTMLDivElement | null>(null);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.SupportRoomSlice.selectedOa);
    const chatRoomRole: ChatRoomRoleSchema = chatRoomRoleSchema;
    const [lastMessage, setLastMessage] = useState<MessageV1Field<ZaloMessageType> | undefined>(undefined);
    const [zaloUser, setZaloUser] = useState<ZaloUserField | undefined>(undefined);
    const [accountWId, setAccountWId] = useState<AccountField | undefined>(undefined);
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

        // socket.on('connect', onConnect);
        socket.on('socketMessageAllRoom', onSocketMessage);

        // nếu socket đã connect sẵn từ trước thì join luôn
        // if (socket.connected) {
        //     onConnect();
        // }

        return () => {
            socket.off('socketMessageAllRoom', onSocketMessage);
            // socket.emit('leaveRoom', chatRoomId);
            // socket.off('connect', onConnect);
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

    const {
        data: data_account_wid,
        // isFetching,
        isLoading: isLoading_account_wid,
        isError: isError_account_wid,
        error: error_account_wid,
    } = useGetAccountWithIdQuery({ id: chatRoomRole?.account_id || -1 }, { skip: chatRoomRole === undefined });
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
        if (!read_element.current || !send_element.current) return;
        const readElement = read_element.current;
        const sendElement = send_element.current;

        const isRead = chatRoomRole.is_read;
        const isSend = chatRoomRole.is_send;

        if (isRead) {
            readElement.classList.add(style.pass);
        }

        if (isSend) {
            sendElement.classList.add(style.pass);
        }
    }, [chatRoomRole]);

    useEffect(() => {
        const chatRoomId = chatRoomRole.chat_room_id;
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
    }, [chatRoomRole, getAllNewMessages]);

    const handleGotoMessage1 = () => {
        navigate(route_enum.MESSAGE1 + '/' + `${chatRoomRole.chat_room_id}`);
    };

    return (
        <div className={style.parent} onClick={() => handleGotoMessage1()}>
            <div className={style.avatarContainer}>
                <img src={zaloUser?.data.avatar} alt="avatar" />
            </div>
            <div className={style.contentContainer}>
                <div className={style.nameContainer}>
                    <div className={style.name}>{zaloUser?.data.display_name}</div>
                </div>
                <div className={style.inforContainer}>
                    <div className={style.infor}>
                        <div>{`${accountWId?.firstName} ${accountWId?.lastName}`}</div>
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
                        {newMessage.length === 0 && lastMessage && (
                            <div className={style.time}>{timeAgoSmart(lastMessage.timestamp)}</div>
                        )}
                        {newMessage.length > 0 && (
                            <div className={style.newMsgAmount}>{handleNewMsgAmount(newMessage.length)}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ARoom);
