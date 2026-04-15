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
import { useGetChatRoomsWithIdQuery } from '@src/redux/query/chatRoomRTK';
import { useGetZaloOaWithIdQuery } from '@src/redux/query/zaloRTK';
import { setData_chatRoom, setData_toastMessage, set_isLoading, set_zaloOa } from '@src/redux/slice/MessageV1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountInformationField } from '@src/dataStruct/account';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { getSocket } from '@src/socketIo';
import { route_enum } from '@src/router/type';

const Message1 = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const chatRoom: ChatRoomField | undefined = useSelector((state: RootState) => state.MessageV1Slice.chatRoom);

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    useEffect(() => {
        if (!id) return;

        const socket = getSocket();
        const chatRoomId = `chatRoomId_${id}`;

        const onConnect = () => {
            socket.emit('joinRoom', chatRoomId);
        };

        socket.on('connect', onConnect);

        // nếu socket đã connect sẵn từ trước thì join luôn
        if (socket.connected) {
            onConnect();
        }

        return () => {
            socket.emit('leaveRoom', chatRoomId);
            socket.off('connect', onConnect);

            // ❌ KHÔNG disconnect ở đây
        };
    }, [id]);

    const {
        data: data_chatRoom,
        // isFetching,
        isLoading: isLoading_chatRoom,
        isError: isError_chatRoom,
        error: error_chatRoom,
    } = useGetChatRoomsWithIdQuery({ id: Number(id) }, { skip: id === undefined });
    useEffect(() => {
        if (isError_chatRoom && error_chatRoom) {
            console.error(error_chatRoom);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Lấy dữ liệu phòng hội thoại KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, isError_chatRoom, error_chatRoom]);
    useEffect(() => {
        dispatch(set_isLoading(isLoading_chatRoom));
    }, [dispatch, isLoading_chatRoom]);
    useEffect(() => {
        const resData = data_chatRoom;
        if (resData?.isSuccess && resData.data) {
            dispatch(setData_chatRoom(resData.data));
        }
    }, [dispatch, data_chatRoom]);

    const {
        data: data_zaloOa,
        // isFetching,
        isLoading: isLoading_zaloOa,
        isError: isError_zaloOa,
        error: error_zaloOa,
    } = useGetZaloOaWithIdQuery(
        { id: chatRoom?.zaloOaId || -1, accountId: accountInformation?.addedById || -1 },
        { skip: chatRoom === undefined || accountInformation === undefined }
    );
    useEffect(() => {
        if (isError_zaloOa && error_zaloOa) {
            console.error(error_zaloOa);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.SUCCESS,
                    message: 'Lấy dữ liệu OA KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, isError_zaloOa, error_zaloOa]);
    useEffect(() => {
        dispatch(set_isLoading(isLoading_zaloOa));
    }, [dispatch, isLoading_zaloOa]);
    useEffect(() => {
        const resData = data_zaloOa;
        // console.log(resData);
        if (resData?.isSuccess && resData.data) {
            // setZaloOa(resData.data);
            dispatch(set_zaloOa(resData.data));
        }
    }, [dispatch, data_zaloOa]);

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{MESSAGE}</div>
                <ReplyMember />
                <MsgList />
                <InputMsg />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default Message1;
