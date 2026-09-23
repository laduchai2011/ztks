import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { useLazy_get_Chat_Rooms_Mongo_Query } from '@src/redux/query/chat_room_RTK';
import { set__data__toast_message, set__is_loading } from '@src/redux/slice/Home_V1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';
import { Chat_Room_Role_Schema } from '@src/data_struct/chat_room';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { SEE_MORE } from '@src/const/text';
import { get_Socket } from '@src/socketIo';
import { Socket_Message_Field } from '@src/data_struct/message_v1';
import User from './component/User';

const UserList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Home_V1_Slice.selected_oa);

    const [chat_room_role_schemas, set__chat_room_role_schemas] = useState<Chat_Room_Role_Schema[]>([]);
    const [cursor, set__cursor] = useState<string | null>(null);
    const limit = 30;
    const [has_more, set__has_more] = useState<boolean>(true);

    const [get_Chat_Rooms_Mongo] = useLazy_get_Chat_Rooms_Mongo_Query();
    const [socket_msg, set__socket_msg] = useState<Socket_Message_Field | undefined>(undefined);

    useEffect(() => {
        const socket = get_Socket();

        const on_Socket_Message_All_Room = (socket_msg: Socket_Message_Field) => {
            const chat_room_id = socket_msg.chat_room_id;

            setTimeout(() => {
                set__chat_room_role_schemas((prev) => {
                    const index = prev.findIndex((item) => item.chat_room_id === chat_room_id);
                    if (index < 0) {
                        set__socket_msg(socket_msg); // nếu người dùng mới
                        return prev;
                    }

                    if (index === 0) {
                        return prev;
                    }

                    const result = prev.filter((item) => item.chat_room_id !== chat_room_id);

                    const item = prev[index];

                    return [item, ...result];
                });
            }, 10);
        };

        socket.on('socketMessageAllRoom', on_Socket_Message_All_Room);

        return () => {
            socket.off('socketMessageAllRoom', on_Socket_Message_All_Room);
        };
    }, []);

    useEffect(() => {
        if (!selected_oa || !account) return;
        if (!socket_msg) return;
        dispatch(set__is_loading(true));
        get_Chat_Rooms_Mongo({
            limit: 1,
            cursor: null,
            is_my: true,
            zalo_oa_id: selected_oa.id,
            account_id: account.id,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__chat_room_role_schemas((prev) => [...(res_data.data?.items || []), ...prev]);
                    // setCursor(resData.data.cursor);
                    // setHasMore(resData.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Lấy danh sách phòng chat KHÔNG thành công !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
                set__socket_msg(undefined);
            });
    }, [socket_msg, dispatch, get_Chat_Rooms_Mongo, selected_oa, account]);

    useEffect(() => {
        if (!selected_oa || !account) return;
        dispatch(set__is_loading(true));
        get_Chat_Rooms_Mongo({
            limit: limit,
            cursor: null,
            is_my: true,
            zalo_oa_id: selected_oa.id,
            account_id: account.id,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__chat_room_role_schemas(res_data.data.items);
                    set__cursor(res_data.data.cursor);
                    set__has_more(res_data.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Lấy danh sách phòng chat KHÔNG thành công !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [dispatch, get_Chat_Rooms_Mongo, selected_oa, account]);

    const handle_See_More = () => {
        if (!selected_oa || !account) return;
        if (!has_more) return;
        dispatch(set__is_loading(true));
        get_Chat_Rooms_Mongo({
            limit: 30,
            cursor: cursor,
            is_my: true,
            zalo_oa_id: selected_oa.id,
            account_id: account.id,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__chat_room_role_schemas((prev) => [...prev, ...(res_data.data?.items || [])]);
                    set__cursor(res_data.data.cursor);
                    set__has_more(res_data.data.cursor !== cursor);
                    set__has_more(res_data.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Lấy danh sách phòng chat KHÔNG thành công !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    const list_chat_room_role = chat_room_role_schemas.map((item, index) => {
        return <User key={index} chat_room_role_schema={item} />;
    });

    return (
        <div className={style.parent}>
            {list_chat_room_role}
            <div className={style.seeMore}>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(UserList);
