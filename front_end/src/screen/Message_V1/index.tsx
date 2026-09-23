import { useEffect } from 'react';
import style from './style.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { MESSAGE } from '@src/const/text';
import InputMsg from './component/InputMsg';
import MsgList from './component/MsgList';
import ReplyMember from './component/ReplyMember';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import ChangeChatRoomMasterDialog from './component/ChangeChatRoomMasterDialog';
import { IoChevronBack } from 'react-icons/io5';
import { use_get_Chat_Rooms_With_Id_Query } from '@src/redux/query/chat_room_RTK';
import { use_get_Zalo_Oa_With_Id_Query } from '@src/redux/query/zalo_RTK';
import { useLazy_get_Last_Message_Query } from '@src/redux/query/message_v1_RTK';
import {
    set__data__chat_room,
    set__data__toast_message,
    set__is_loading,
    set__zalo_oa,
    set__is_show__change_chat_room_master_dialog,
    set_uid,
} from '@src/redux/slice/Message_V1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Information_Field } from '@src/data_struct/account';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { get_Socket } from '@src/socketIo';
import { route_enum } from '@src/router/type';

const Message1 = () => {
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const chat_room: Chat_Room_Field | undefined = useSelector((state: RootState) => state.Message_V1_Slice.chat_room);

    const [get_Last_Message] = useLazy_get_Last_Message_Query();

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        return () => {
            dispatch(
                set__data__toast_message({
                    type: undefined,
                    message: '',
                })
            );
            dispatch(set__is_show__change_chat_room_master_dialog(false));
        };
    }, [dispatch]);

    useEffect(() => {
        if (!id) return;

        const socket = get_Socket();
        const chat_room_id = `chat_room_id_${id}`;

        const onConnect = () => {
            socket.emit('joinRoom', chat_room_id);
        };

        socket.on('connect', onConnect);

        // nếu socket đã connect sẵn từ trước thì join luôn
        if (socket.connected) {
            onConnect();
        }

        return () => {
            socket.emit('leaveRoom', chat_room_id);
            socket.off('connect', onConnect);

            // ❌ KHÔNG disconnect ở đây
        };
    }, [id]);

    const {
        data: data__chat_room,
        // isFetching,
        isLoading: is_loading__chat_room,
        isError: is_error__chat_room,
        error: error__chat_room,
    } = use_get_Chat_Rooms_With_Id_Query({ id: id || '' }, { skip: id === undefined });
    useEffect(() => {
        if (is_error__chat_room && error__chat_room) {
            console.error(error__chat_room);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Lấy dữ liệu phòng hội thoại KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, is_error__chat_room, error__chat_room]);
    useEffect(() => {
        dispatch(set__is_loading(is_loading__chat_room));
    }, [dispatch, is_loading__chat_room]);
    useEffect(() => {
        const res_data = data__chat_room;
        if (res_data?.is_success && res_data.data) {
            dispatch(set__data__chat_room(res_data.data));
        }
    }, [dispatch, data__chat_room]);

    const {
        data: data__zalo_oa,
        // isFetching,
        isLoading: is_loading__zalo_oa,
        isError: is_error__zalo_oa,
        error: error__zalo_oa,
    } = use_get_Zalo_Oa_With_Id_Query(
        { id: chat_room?.zalo_oa_id || '', account_id: account_information?.added_by_id || '' },
        { skip: chat_room === undefined || account_information === undefined }
    );
    useEffect(() => {
        if (is_error__zalo_oa && error__zalo_oa) {
            console.error(error__zalo_oa);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.SUCCESS,
                    message: 'Lấy dữ liệu OA KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, is_error__zalo_oa, error__zalo_oa]);
    useEffect(() => {
        dispatch(set__is_loading(is_loading__zalo_oa));
    }, [dispatch, is_loading__zalo_oa]);
    useEffect(() => {
        const res_data = data__zalo_oa;
        if (res_data?.is_success && res_data.data) {
            dispatch(set__zalo_oa(res_data.data));
        }
    }, [dispatch, data__zalo_oa]);

    useEffect(() => {
        if (!id) return;
        get_Last_Message({ chat_room_id: id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    const last_message = res_data.data;
                    const event_name = last_message.event_name;

                    const is_user_send = event_name.startsWith('user_send');
                    const is_oa_send = event_name.startsWith('oa_send');

                    if ('call_id' in last_message) {
                        dispatch(set_uid(last_message.user_id));
                    } else {
                        if (is_user_send) {
                            dispatch(set_uid(last_message.sender_id));
                        }

                        if (is_oa_send) {
                            dispatch(set_uid(last_message.recipient_id));
                        }
                    }
                }
            })
            .catch((err) => console.error(err));
    }, [dispatch, get_Last_Message, id]);

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{MESSAGE}</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
                <ReplyMember />
                <MsgList />
                <InputMsg />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <ChangeChatRoomMasterDialog />
            </div>
        </div>
    );
};

export default Message1;
