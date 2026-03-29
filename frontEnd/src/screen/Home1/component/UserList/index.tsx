import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import User from './component/User';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { useLazyGetChatRoomsMongoQuery } from '@src/redux/query/chatRoomRTK';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/Home1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';
import { ChatRoomRoleSchema } from '@src/dataStruct/chatRoom';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { SEE_MORE } from '@src/const/text';
import { getSocket } from '@src/socketIo';
import { SocketMessageField } from '@src/dataStruct/message_v1';

const UserList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.Home1Slice.selectedOa);
    const [chatRoomRoleSchemas, setChatRoomRoleSchemas] = useState<ChatRoomRoleSchema[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const limit = 30;
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [getChatRoomsMongo] = useLazyGetChatRoomsMongoQuery();
    const [socketMsg, setSocketMsg] = useState<SocketMessageField | undefined>(undefined);

    useEffect(() => {
        const socket = getSocket();

        const onSocketMessageAllRoom = (socketMsg: SocketMessageField) => {
            const chatRoomId = socketMsg.chatRoomId;

            setTimeout(() => {
                setChatRoomRoleSchemas((prev) => {
                    const index = prev.findIndex((item) => item.chat_room_id === chatRoomId);
                    if (index < 0) {
                        setSocketMsg(socketMsg); // nếu người dùng mới
                        return prev;
                    }

                    if (index === 0) {
                        return prev;
                    }

                    const result = prev.filter((item) => item.chat_room_id !== chatRoomId);

                    const item = prev[index];

                    return [item, ...result];
                });
            }, 10);
        };

        socket.on('socketMessageAllRoom', onSocketMessageAllRoom);

        return () => {
            socket.off('socketMessageAllRoom', onSocketMessageAllRoom);
        };
    }, []);

    useEffect(() => {
        if (!selectedOa || !account) return;
        if (!socketMsg) return;
        dispatch(set_isLoading(true));
        getChatRoomsMongo({
            limit: 1,
            cursor: null,
            isMy: true,
            zaloOaId: selectedOa.id,
            accountId: account.id,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setChatRoomRoleSchemas((prev) => [...(resData.data?.items || []), ...prev]);
                    // setCursor(resData.data.cursor);
                    // setHasMore(resData.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Lấy danh sách phòng chat KHÔNG thành công !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
                setSocketMsg(undefined);
            });
    }, [socketMsg, dispatch, getChatRoomsMongo, selectedOa, account]);

    useEffect(() => {
        if (!selectedOa || !account) return;
        dispatch(set_isLoading(true));
        getChatRoomsMongo({
            limit: limit,
            cursor: null,
            isMy: true,
            zaloOaId: selectedOa.id,
            accountId: account.id,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setChatRoomRoleSchemas(resData.data.items);
                    setCursor(resData.data.cursor);
                    setHasMore(resData.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Lấy danh sách phòng chat KHÔNG thành công !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [dispatch, getChatRoomsMongo, selectedOa, account]);

    const handleSeeMore = () => {
        if (!selectedOa || !account) return;
        if (!hasMore) return;
        dispatch(set_isLoading(true));
        getChatRoomsMongo({
            limit: 30,
            cursor: cursor,
            isMy: true,
            zaloOaId: selectedOa.id,
            accountId: account.id,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setChatRoomRoleSchemas((prev) => [...prev, ...(resData.data?.items || [])]);
                    setCursor(resData.data.cursor);
                    setHasMore(resData.data.cursor !== cursor);
                    setHasMore(resData.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Lấy danh sách phòng chat KHÔNG thành công !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const list_chatRoomRole = chatRoomRoleSchemas.map((item, index) => {
        return <User key={index} chatRoomRoleSchema={item} />;
    });

    return (
        <div className={style.parent}>
            {list_chatRoomRole}
            <div className={style.seeMore}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(UserList);
