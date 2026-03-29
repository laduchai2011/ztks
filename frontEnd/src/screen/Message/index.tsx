import { useRef, useState, useEffect, useCallback, useId } from 'react';
import { useParams } from 'react-router-dom';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import TopIcons from './components/TopIcons';
import YourMessage from './components/YourMessage';
import MyMessage from './components/MyMessage';
import { MESSAGE } from '@src/const/text';
import { MessageField } from '@src/dataStruct/message';
import { IoMdSend } from 'react-icons/io';
import { useCreateMessageMutation } from '@src/redux/query/messageRTK';
import io from 'socket.io-client';
import { SocketType } from '@src/dataStruct/socketIo';
import { SOCKET_URL } from '@src/const/api/socketUrl';
import { FaImage } from 'react-icons/fa';
import { MdOndemandVideo } from 'react-icons/md';
import MyToastMessage from './components/MyToastMessage';
import MyLoading from './components/MyLoading';
import PlayVideo from './components/PlayVideo';
import {
    setData_toastMessage,
    // setData_messages,
    loadData_messages,
    addNew_message,
    delA_message,
    updateA_message,
} from '@src/redux/slice/Message';
import { messageType_enum as toastMessageType_enum } from '@src/component/ToastMessage/type';
import { BASE_URL, isProduct } from '@src/const/api/baseUrl';
import {
    MessageImageField,
    MessageVideoField,
    MessageImageUrlField,
    MessageVideoUrlField,
    MessageTextField,
    HookDataField,
    ZaloMessage,
} from '@src/dataStruct/hookData';
import { zalo_event_name_enum, MessageZaloField, ZaloCustomerField } from '@src/dataStruct/hookData';
import { sender_enum, CreateMessageBodyField, messageStatus_enum, messageType_enum } from '@src/dataStruct/message';
import { useGetMessagesQuery } from '@src/redux/query/messageRTK';
import { useGetInforCustomerOnZaloQuery } from '@src/redux/query/myCustomerRTK';
import { uploadVideo, uploadImage, handleSendVideoTdFailure, handleSendVideoTdSuccess } from './handle';
import { VideoTDBodyField } from '@src/dataStruct/video';

const apiString = isProduct ? '' : '/api';
const OAID = '2018793888801741529';
const MAX_SIZE = 25 * 1024 * 1024; // 25MB

const Message = () => {
    const dispatch = useDispatch<AppDispatch>();
    const myId = sessionStorage.getItem('myId');
    const { id } = useParams<{ id: string }>();
    // const [hasMore, setHasMore] = useState(true);
    const contentContainer_element = useRef<HTMLDivElement | null>(null);
    // const [messages, setMessages] = useState<MessageField[]>([]);
    // const [index_mes, set_index_mes] = useState<number>(6);
    const [newMessage, setNewMessage] = useState<string>('');
    const id_imageInput = useId();
    const id_videoInput = useId();
    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const videoInput_element = useRef<HTMLInputElement | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [is_open_chatRoom_tadao, set_is_open_chatRoom_tadao] = useState<boolean | undefined>(undefined);
    const [is_success_sendVideo, set_is_success_sendVideo] = useState<boolean | undefined>(undefined);
    const socketRef = useRef<SocketType | undefined>(undefined);
    const messageId_videoTd_current = useRef<number>(-1);
    const messageVideo_current = useRef<MessageField | null>(null);
    const [createMessage] = useCreateMessageMutation();
    const [root_LazyVideo, set_root_LazyVideo] = useState<HTMLDivElement | null>(null);
    const messages: MessageField[] = useSelector((state: RootState) => state.MessageSlice.messages);

    useEffect(() => {
        if (contentContainer_element.current) {
            set_root_LazyVideo(contentContainer_element.current);
        }
    }, []);

    useEffect(() => {
        dispatch(
            setData_toastMessage({
                type: undefined,
                message: '',
            })
        );
    }, [dispatch]);

    useEffect(() => {
        if (is_success_sendVideo === true) {
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.SUCCESS,
                    message: 'Gửi thước phim thành công !',
                })
            );
        }
        if (is_success_sendVideo === false) {
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.SUCCESS,
                    message: 'Gửi thước phim KHÔNG thành công !',
                })
            );
        }
    }, [is_success_sendVideo, dispatch]);

    useEffect(() => {
        // setMessages([]);
        // dispatch(setData_messages([]));
    }, [id, dispatch]);

    const [zaloCustomer, setZaloCustomer] = useState<ZaloCustomerField | undefined>(undefined);
    const {
        data: data_zaloInforCustomer,
        // isFetching,
        isLoading: isLoading_zaloInforCustomer,
        isError: isError_zaloInforCustomer,
        error: error_zaloInforCustomer,
    } = useGetInforCustomerOnZaloQuery({ customerId: id || '' }, { skip: id === undefined });
    useEffect(() => {
        if (isError_zaloInforCustomer && error_zaloInforCustomer) {
            console.error(error_zaloInforCustomer);
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.ERROR,
                    message: 'Lấy dữ liệu từ zalo KHÔNG thành công !',
                })
            );
        }
    }, [isError_zaloInforCustomer, error_zaloInforCustomer, dispatch]);
    useEffect(() => {
        // setIsLoading(isLoading_medication);
    }, [isLoading_zaloInforCustomer]);
    useEffect(() => {
        const resData = data_zaloInforCustomer;
        if (resData?.isSuccess && resData.data && resData.data.error === 0) {
            setZaloCustomer(resData.data);
        }
    }, [data_zaloInforCustomer]);

    const {
        data: data_messages,
        // isFetching,
        isLoading: isLoading_messages,
        isError: isError_messages,
        error: error_messages,
    } = useGetMessagesQuery(
        { page: 1, size: 2000, receiveId: id || '', accountId: Number(myId) },
        { skip: myId === null || id === undefined }
    );
    useEffect(() => {
        if (isError_messages && error_messages) {
            console.error(error_messages);
            // dispatch(
            //     setData_toastMessage({
            //         type: messageType_enum.SUCCESS,
            //         message: 'Lấy dữ liệu KHÔNG thành công !',
            //     })
            // );
        }
    }, [isError_messages, error_messages]);
    useEffect(() => {
        // setIsLoading(isLoading_medication);
    }, [isLoading_messages]);
    useEffect(() => {
        const resData = data_messages;
        console.log(11111, messages.length);
        if (resData?.isSuccess && resData.data && messages.length === 0) {
            const mes = resData.data.items;
            // setMessages((prev) => mes.concat(prev));
            dispatch(loadData_messages(mes));
        }
    }, [data_messages, dispatch, messages]);

    useEffect(() => {
        // loadMore();
    }, []);

    useEffect(() => {
        if (!myId) return;
        if (!id) return;
        const myRoom = myId + id;

        // Kết nối server
        socketRef.current = io(SOCKET_URL || '', { path: '/socket.io/' });
        // socketRef.current = io('wss://socketapp.5kaquarium.com', {
        //     path: '/socket.io/',
        // });

        if (!socketRef.current) return;
        const socket = socketRef.current;
        socket.on('connect', () => {
            console.log('Connected:', socket.id);
        });

        // Nhận message từ server
        socket.on('roomMessage', (message: any) => {
            // setMessages((prev) => [...prev, data]);
            const mes = JSON.parse(message) as MessageZaloField;
            const data = mes.data as HookDataField;
            const event_name = data.event_name;
            switch (event_name) {
                case zalo_event_name_enum.user_send_text: {
                    const hookData: HookDataField<ZaloMessage> = {
                        app_id: '',
                        user_id_by_app: '',
                        event_name: zalo_event_name_enum.user_send_text,
                        sender: {
                            id: myId,
                        },
                        recipient: {
                            id: id,
                        },
                        message: data.message,
                        timestamp: '',
                    };
                    const newMessage: MessageField = {
                        id: -1,
                        eventName: zalo_event_name_enum.user_send_text,
                        sender: sender_enum.CUSTOMER,
                        receiveId: myId,
                        message: JSON.stringify(hookData),
                        type: messageType_enum.TEXT,
                        timestamp: data.timestamp,
                        messageStatus: messageStatus_enum.SENT,
                        status: 'normal',
                        accountId: Number(myId),
                        updateTime: '',
                        createTime: '',
                    };
                    // setMessages((prev) => [newMessage, ...prev]);
                    addNew_message(newMessage);
                    break;
                }
                case zalo_event_name_enum.user_send_image: {
                    const hookData: HookDataField<ZaloMessage> = {
                        app_id: '',
                        user_id_by_app: '',
                        event_name: zalo_event_name_enum.user_send_image,
                        sender: {
                            id: myId,
                        },
                        recipient: {
                            id: id,
                        },
                        message: data.message,
                        timestamp: '',
                    };
                    const newMessage: MessageField = {
                        id: -1,
                        eventName: zalo_event_name_enum.user_send_image,
                        sender: sender_enum.CUSTOMER,
                        receiveId: myId,
                        message: JSON.stringify(hookData),
                        type: messageType_enum.IMAGES,
                        timestamp: data.timestamp,
                        messageStatus: messageStatus_enum.SENT,
                        status: 'normal',
                        accountId: Number(myId),
                        updateTime: '',
                        createTime: '',
                    };
                    // setMessages((prev) => [newMessage, ...prev]);
                    addNew_message(newMessage);
                    break;
                }
                case zalo_event_name_enum.user_send_video: {
                    const hookData: HookDataField<ZaloMessage> = {
                        app_id: '',
                        user_id_by_app: '',
                        event_name: zalo_event_name_enum.user_send_video,
                        sender: {
                            id: myId,
                        },
                        recipient: {
                            id: id,
                        },
                        message: data.message,
                        timestamp: '',
                    };
                    const newMessage: MessageField = {
                        id: -1,
                        eventName: zalo_event_name_enum.user_send_video,
                        sender: sender_enum.CUSTOMER,
                        receiveId: myId,
                        message: JSON.stringify(hookData),
                        type: messageType_enum.VIDEOS,
                        timestamp: data.timestamp,
                        messageStatus: messageStatus_enum.SENT,
                        status: 'normal',
                        accountId: Number(myId),
                        updateTime: '',
                        createTime: '',
                    };
                    // setMessages((prev) => [newMessage, ...prev]);
                    addNew_message(newMessage);
                    break;
                }
                default: {
                    //statements;
                    break;
                }
            }
        });

        socket.emit('joinRoom', myRoom);

        const oaid = OAID;
        const uid = id;
        const accountId = myId;
        socket.on('open_chatRoom_tadao_success', () => {
            set_is_open_chatRoom_tadao(true);
        });
        socket.on('open_chatRoom_tadao_failure', () => {
            set_is_open_chatRoom_tadao(false);
        });
        socket.on('send_videoTD_success', () => {
            set_is_success_sendVideo(true);
        });
        socket.on('send_videoTD_failure', () => {
            handleSendVideoTdFailure({ id: messageId_videoTd_current.current })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        dispatch(
                            setData_toastMessage({
                                type: toastMessageType_enum.SUCCESS,
                                message: 'Tin nhắn videoTd bị xóa do gửi thất bại !',
                            })
                        );
                        // setMessages((pre) => {
                        //     const newArr = pre.filter((item) => item.id !== messageId_videoTd_current.current);
                        //     return newArr;
                        // });
                        dispatch(delA_message({ id: messageId_videoTd_current.current }));
                    } else {
                        dispatch(
                            setData_toastMessage({
                                type: toastMessageType_enum.ERROR,
                                message: 'Tin nhắn videoTd gửi đi thất bại nhưng không xóa được khỏi DB !',
                            })
                        );
                    }
                })
                .catch((err) => console.error(err));
            set_is_success_sendVideo(false);
        });
        socket.on('getUrl_videoTd', ({ oaid, receiveId, accountId, name }: VideoTDBodyField) => {
            if (!messageVideo_current.current) {
                setData_toastMessage({
                    type: toastMessageType_enum.ERROR,
                    message: 'Cập nhật tin nhắn videoTd khi gửi thất bại !',
                });
                return;
            } else if (messageVideo_current.current) {
                const message = messageVideo_current.current.message;
                const hookData: HookDataField<MessageVideoField> =
                    typeof message === 'string' ? JSON.parse(message) : structuredClone(message);
                hookData.message.attachment.payload.elements[0].url = name;
                messageVideo_current.current = { ...messageVideo_current.current, message: JSON.stringify(hookData) };
                handleSendVideoTdSuccess({
                    id: messageVideo_current.current.id,
                    message: messageVideo_current.current.message,
                })
                    .then((res) => {
                        const resData = res.data;
                        if (resData?.isSuccess && resData?.data) {
                            dispatch(
                                setData_toastMessage({
                                    type: toastMessageType_enum.SUCCESS,
                                    message: 'Cập nhật tin nhắn videoTd khi gửi thành công !',
                                })
                            );
                            if (messageVideo_current.current) {
                                dispatch(updateA_message(messageVideo_current.current));
                            }
                            // setMessages((prev) => {
                            //     if (messageVideo_current.current) {
                            //         const new_mes = prev.filter(
                            //             (item) =>
                            //                 messageVideo_current.current && item.id !== messageVideo_current.current.id
                            //         );
                            //         new_mes.unshift(messageVideo_current.current);
                            //         return new_mes;
                            //     }
                            //     return prev;
                            // });
                        } else {
                            dispatch(
                                setData_toastMessage({
                                    type: toastMessageType_enum.ERROR,
                                    message: 'Cập nhật tin nhắn videoTd khi gửi thất bại !',
                                })
                            );
                        }
                    })
                    .catch((err) => console.error(err))
                    .finally(() => {
                        messageVideo_current.current = null;
                    });
            }
        });
        socket.emit('open_chatRoom_tadao', { oaid, uid, accountId });

        return () => {
            socket.emit('close_chatRoom_tadao', { oaid, uid, accountId });
            socket.emit('leaveRoom', myId);
            socket.disconnect();
        };
    }, [dispatch, myId, id]);

    useEffect(() => {
        if (is_open_chatRoom_tadao === true) {
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.SUCCESS,
                    message: 'Mở phòng chat tà đạo thành công !',
                })
            );
        }
        if (is_open_chatRoom_tadao === false) {
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.ERROR,
                    message: 'Mở phòng chat tà đạo thất bại !',
                })
            );
        }
    }, [is_open_chatRoom_tadao, dispatch]);

    const handleScroll = () => {
        const contentContainerElement = contentContainer_element.current;
        if (!contentContainerElement) return;

        const scrollTop = contentContainerElement.scrollTop;
        const scrollHeight = contentContainerElement.scrollHeight;
        const clientHeight = contentContainerElement.clientHeight;

        if (-1 * scrollTop + clientHeight > scrollHeight - 200) {
            // loadMore();
        }
    };

    // const loadMore = async () => {
    //     if (!hasMore) return;

    //     const contentContainerElement = contentContainer_element.current;
    //     const oldScrollHeight = contentContainerElement?.scrollHeight ?? 0;

    //     // setData((prev) => [index_mes + 1, ...prev]);
    //     // set_index_mes((prev) => prev + 1);

    //     // GIỮ NGUYÊN CHỖ ĐANG ĐỌC SAU KHI THÊM TIN
    //     requestAnimationFrame(() => {
    //         if (contentContainerElement) {
    //             const newScrollHeight = contentContainerElement.scrollHeight;
    //             contentContainerElement.scrollTop = newScrollHeight - oldScrollHeight;
    //         }
    //     });
    // };

    const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewMessage(value);
    };

    const handleSend = () => {
        if (!myId) return;
        if (!id) return;
        const myRoom = myId + id;
        const newMes = newMessage.trim();
        setNewMessage('');
        if (newMes.length !== 0) {
            const messageText: MessageTextField = {
                text: newMes,
                msg_id: '',
            };

            const hookData: HookDataField<MessageTextField> = {
                app_id: '',
                user_id_by_app: '',
                event_name: zalo_event_name_enum.member_sending,
                sender: {
                    id: myId,
                },
                recipient: {
                    id: id,
                },
                message: messageText,
                timestamp: '',
            };
            const createMessageBody: CreateMessageBodyField = {
                eventName: zalo_event_name_enum.member_sending,
                sender: sender_enum.MEMBER,
                senderId: myId,
                receiveId: id,
                type: messageType_enum.TEXT,
                message: JSON.stringify(hookData),
                timestamp: '',
                messageStatus: messageStatus_enum.SENDING,
                accountId: -1,
            };
            // console.log('handleSendCommon', createMessageBody);
            setIsSending(true);
            createMessage(createMessageBody)
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        const newData: MessageField = resData.data;
                        // setMessages((prev) => [newData, ...prev]);
                        dispatch(addNew_message(newData));
                        socketRef.current?.emit('roomMessage', {
                            roomName: myRoom,
                            message: JSON.stringify(resData.data),
                        });
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => setIsSending(false));
        }
    };

    const handleVideoIconClick = () => {
        videoInput_element.current?.click();
    };
    const handlePreVideo = useCallback(
        async (localVideo: File) => {
            if (!myId) return;
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.NORMAL,
                    message: 'Bắt đầu đăng tải thước phim !',
                })
            );
            const objectName = await uploadVideo(localVideo, myId);
            if (!objectName) {
                dispatch(
                    setData_toastMessage({
                        type: toastMessageType_enum.ERROR,
                        message: 'Đăng tải thước phim thất bại !',
                    })
                );
                return;
            }
            return objectName;
        },
        [dispatch, myId]
    );
    const handleVideoChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!myId) return;
            if (!id) return;
            // const myRoom = myId + id;
            const files = event.target.files;
            if (files) {
                const videos: File[] = [];
                Array.from(files).forEach((file) => {
                    if (file.type.startsWith('video/')) {
                        videos.push(file);
                    }
                });
                if (videos[0].size > MAX_SIZE) {
                    alert('File quá lớn! Chỉ cho phép tối đa 25MB');
                    return;
                }
                setIsSending(true);
                const objectName = await handlePreVideo(videos[0]);
                if (objectName) {
                    dispatch(
                        setData_toastMessage({
                            type: toastMessageType_enum.NORMAL,
                            message: 'Bắt đầu gửi video !',
                        })
                    );
                    const aVideo: MessageVideoUrlField = {
                        media_type: 'video',
                        url: '',
                        thumbnail: '',
                    };
                    const videoUrls = [aVideo];
                    const messageVideos: MessageVideoField = {
                        text: '',
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'media',
                                elements: videoUrls,
                            },
                        },
                    };
                    // handleSendCommon(messageVideos, messageType_enum.VIDEOS);

                    const hookData: HookDataField<MessageVideoField> = {
                        app_id: '',
                        user_id_by_app: '',
                        event_name: zalo_event_name_enum.member_sending,
                        sender: {
                            id: myId,
                        },
                        recipient: {
                            id: id,
                        },
                        message: messageVideos,
                        timestamp: '',
                    };
                    const createMessageBody: CreateMessageBodyField = {
                        eventName: zalo_event_name_enum.member_sending,
                        sender: sender_enum.MEMBER,
                        senderId: myId,
                        receiveId: id,
                        type: messageType_enum.VIDEOS,
                        message: JSON.stringify(hookData),
                        timestamp: '',
                        messageStatus: messageStatus_enum.SENDING,
                        accountId: -1,
                    };
                    createMessage(createMessageBody)
                        .then((res) => {
                            const resData = res.data;
                            set_is_success_sendVideo(undefined);
                            if (resData?.isSuccess && resData.data) {
                                messageId_videoTd_current.current = resData.data.id;
                                dispatch(
                                    setData_toastMessage({
                                        type: toastMessageType_enum.SUCCESS,
                                        message: 'Bắt đầu gửi thước phim !',
                                    })
                                );
                                const newData: MessageField = resData.data;
                                messageVideo_current.current = newData;
                                // setMessages((prev) => [newData, ...prev]);
                                dispatch(addNew_message(newData));
                                socketRef.current?.emit('send_videoTD', {
                                    receiveId: id,
                                    oaid: OAID,
                                    name: objectName,
                                    accountId: myId,
                                });
                            }
                        })
                        .catch((err) => console.error(err))
                        .finally(() => setIsSending(false));
                } else {
                    setIsSending(false);
                }
            }
        },
        [handlePreVideo, createMessage, id, myId, dispatch]
    );

    const handleImageIconClick = () => {
        imageInput_element.current?.click();
    };
    const handlePreImage = useCallback(
        async (localImage: File) => {
            if (!myId) return;
            const imageUrls: MessageImageUrlField[] = [];
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.NORMAL,
                    message: 'Bắt đầu đăng tải hình ảnh !',
                })
            );
            const resData_image = await uploadImage(localImage, myId);
            if (!resData_image) {
                dispatch(
                    setData_toastMessage({
                        type: toastMessageType_enum.ERROR,
                        message: 'Đăng tải hình ảnh thất bại !',
                    })
                );
                return;
            }
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.SUCCESS,
                    message: 'Đăng tải hình ảnh thành công !',
                })
            );
            const filename = resData_image.filename;
            const imageUrl = `${BASE_URL}${apiString}/service_image/store/${filename}`;
            // const imageUrl =
            //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbmax3TR2v-X8x0cq0Af_bTxAiu15ONjQwWw&s';
            const aImage: MessageImageUrlField = {
                media_type: 'image',
                url: imageUrl,
            };
            imageUrls.push(aImage);

            return { imageUrls: imageUrls };
        },
        [dispatch, myId]
    );
    const handleImageChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!myId) return;
            if (!id) return;
            const myRoom = myId + id;
            const files = event.target.files;
            if (files) {
                const images: File[] = [];
                Array.from(files).forEach((file) => {
                    if (file.type.startsWith('image/')) {
                        images.push(file);
                    }
                });
                if (images[0].size > MAX_SIZE) {
                    alert('File quá lớn! Chỉ cho phép tối đa 25MB');
                    return;
                }
                setIsSending(true);
                const resPreImage = await handlePreImage(images[0]);
                if (resPreImage) {
                    const imageUrls: MessageImageUrlField[] = resPreImage.imageUrls;
                    const messageImages: MessageImageField = {
                        text: '',
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'media',
                                elements: imageUrls,
                            },
                        },
                    };

                    const hookData: HookDataField<MessageImageField> = {
                        app_id: '',
                        user_id_by_app: '',
                        event_name: zalo_event_name_enum.member_sending,
                        sender: {
                            id: myId,
                        },
                        recipient: {
                            id: id,
                        },
                        message: messageImages,
                        timestamp: '',
                    };
                    const createMessageBody: CreateMessageBodyField = {
                        eventName: zalo_event_name_enum.member_sending,
                        sender: sender_enum.MEMBER,
                        senderId: myId,
                        receiveId: id,
                        type: messageType_enum.IMAGES,
                        message: JSON.stringify(hookData),
                        timestamp: '',
                        messageStatus: messageStatus_enum.SENDING,
                        accountId: -1,
                    };
                    createMessage(createMessageBody)
                        .then((res) => {
                            const resData = res.data;
                            if (resData?.isSuccess && resData.data) {
                                const newData: MessageField = resData.data;
                                // setMessages((prev) => [newData, ...prev]);
                                dispatch(addNew_message(newData));
                                socketRef.current?.emit('roomMessage', {
                                    roomName: myRoom,
                                    message: JSON.stringify(resData.data),
                                });
                            }
                        })
                        .catch((err) => console.error(err))
                        .finally(() => setIsSending(false));
                }
            }
        },
        [dispatch, handlePreImage, createMessage, id, myId]
    );

    const list_mes = messages.map((item, index) => {
        const sender = item.sender;
        if (sender === sender_enum.MEMBER) {
            return <MyMessage key={item.id} data={item} root_LazyVideo={root_LazyVideo} />;
        }
        if (sender === sender_enum.CUSTOMER) {
            return <YourMessage key={item.id} data={item} />;
        }
    });

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{`${MESSAGE} - ${zaloCustomer?.data.display_name}`}</div>
                <TopIcons />
                <div className={style.contentContainer} ref={contentContainer_element} onScroll={handleScroll}>
                    {list_mes}
                </div>
                <div className={style.iconContainer}>
                    <FaImage id={id_imageInput} onClick={handleImageIconClick} />
                    <input
                        ref={imageInput_element}
                        onChange={handleImageChange}
                        type="file"
                        id={id_imageInput}
                        accept="image/*"
                    />
                    {is_open_chatRoom_tadao && <MdOndemandVideo id={id_videoInput} onClick={handleVideoIconClick} />}
                    <input
                        ref={videoInput_element}
                        onChange={handleVideoChange}
                        type="file"
                        id={id_videoInput}
                        accept="video/*"
                    />
                </div>
                <div className={style.inputContainer}>
                    <input value={newMessage} onChange={(e) => handleNewMessageChange(e)} placeholder="Viết tin nhắn" />
                    <IoMdSend onClick={() => handleSend()} size={30} color="blue" />
                </div>
                <div>
                    <MyToastMessage />
                    <MyLoading isLoading={isSending} />
                    <PlayVideo />
                </div>
            </div>
        </div>
    );
};

export default Message;
