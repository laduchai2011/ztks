import { memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import UserMsg from './component/UserMsg';
import MyMsg from './component/MyMsg';
import {
    useLazy_get_Messages_For_Chat_Screen_Query,
    useLazy_get_Message_With_Id_Query,
    useLazy_del_All_New_Messages_Query,
} from '@src/redux/query/message_v1_RTK';
import { Message_V1_Field, Call_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type, Zalo_Call_Type } from '@src/data_struct/zalo/hook_data';
import { get_Socket } from '@src/socketIo';
import { Socket_Message_Field } from '@src/data_struct/message_v1';

const MsgList = () => {
    const { id } = useParams<{ id: string }>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const bottom_element = useRef<HTMLDivElement | null>(null);

    const [messages, set__messages] = useState<(Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type>)[]>(
        []
    );
    const size = 20;
    const lock_load_more = useRef<boolean>(true);
    const [cursor, set__cursor] = useState<string | null>(null);
    const [is_loading_more, set__is_loading_more] = useState(false);
    const [has_more, set__has_more] = useState(true);

    const [get_Message_With_Id] = useLazy_get_Message_With_Id_Query();
    const [del_All_New_Messages] = useLazy_del_All_New_Messages_Query();
    const [get_Messages] = useLazy_get_Messages_For_Chat_Screen_Query();

    useEffect(() => {
        if (!id) return;
        const socket = get_Socket();

        const handle_Del_Msg = () => {
            del_All_New_Messages({ chat_room_id: id })
                .then((res) => {
                    const res_data = res.data;
                    console.log('del_All_New_Messages', res_data);
                })
                .catch((err) => {
                    console.error(err);
                });
        };
        handle_Del_Msg();

        const scroll_To_Bottom = () => {
            if (!bottom_element.current) return;
            const bottomElement = bottom_element.current;
            bottomElement.scrollIntoView({ behavior: 'auto' });
        };

        const on_Socket_Message = (socket_msg: Socket_Message_Field) => {
            const msg_id = socket_msg._id;
            get_Message_With_Id({ id: msg_id })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        const newMsg = res_data.data;
                        set__messages((prev) => [...prev, newMsg]);
                        setTimeout(() => {
                            scroll_To_Bottom();
                            handle_Del_Msg();
                        }, 10);
                    }
                })
                .catch((err) => console.error(err));
        };

        socket.on('socketMessage', on_Socket_Message);

        return () => {
            socket.off('socketMessage', on_Socket_Message);
        };
    }, [id, get_Message_With_Id, del_All_New_Messages]);

    useEffect(() => {
        if (!id) return;
        get_Messages({ cursor: null, size: size, chat_room_id: id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__messages(res_data.data?.items);
                    set__cursor(res_data.data.cursor);
                    set__has_more(res_data.data?.items.length === size);
                }
                requestAnimationFrame(() => {
                    if (!parent_element.current) return;
                    const parentElement = parent_element.current;
                    parentElement.scrollTop = parentElement.scrollHeight;
                });
            })
            .catch((err) => console.error(err))
            .finally(() => (lock_load_more.current = false));
    }, [get_Messages, id]);

    useEffect(() => {
        const scroll_To_Bottom = () => {
            if (!bottom_element.current) return;
            const bottomElement = bottom_element.current;
            bottomElement.scrollIntoView({ behavior: 'auto' });
        };
        scroll_To_Bottom();
        setTimeout(() => {
            scroll_To_Bottom();
        }, 1000);
        setTimeout(() => {
            scroll_To_Bottom();
        }, 2000);
    }, []);

    const loadMore = async () => {
        if (!id) return;
        if (lock_load_more.current) return;
        if (!has_more || is_loading_more) return;
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        set__is_loading_more(true);

        const container = parentElement;
        const prevScrollHeight = container.scrollHeight;
        const prevScrollTop = container.scrollTop;

        get_Messages({ cursor: cursor, size: size, chat_room_id: id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__messages((pre) => [...(res_data.data?.items || []), ...pre]);
                    set__cursor(res_data.data.cursor);
                    set__has_more(res_data.data?.items.length === size);
                }
                requestAnimationFrame(() => {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
                    set__is_loading_more(false);
                });
            })
            .catch((err) => console.error(err))
            .finally(() => (lock_load_more.current = false));
    };

    const onScroll = () => {
        const el = parent_element.current;
        if (!el) return;

        if (el.scrollTop <= 20) {
            loadMore();
        }
    };

    const list_message = messages.map((item, index) => {
        const event_name = item.event_name;
        const is_user_send = event_name.startsWith('user_send');
        const is_oa_send = event_name.startsWith('oa_send');
        const is_user_call = event_name.startsWith('user_call');
        const is_oa_call = event_name.startsWith('oa_call');

        if ('call_id' in item) {
            if (is_user_call) {
                return <UserMsg key={index} msgList_element={parent_element.current} data={item} messages={messages} />;
            }

            if (is_oa_call) {
                return <MyMsg key={index} msgList_element={parent_element.current} data={item} messages={messages} />;
            }
        } else {
            if (is_user_send) {
                return <UserMsg key={index} msgList_element={parent_element.current} data={item} messages={messages} />;
            }

            if (is_oa_send) {
                return <MyMsg key={index} msgList_element={parent_element.current} data={item} messages={messages} />;
            }
        }

        return;
    });

    return (
        <div className={style.parent} ref={parent_element} onScroll={onScroll}>
            {is_loading_more && <div className={style.loading}>Đang tải ...</div>}
            {list_message}
            <div ref={bottom_element}></div>
        </div>
    );
};

export default memo(MsgList);
