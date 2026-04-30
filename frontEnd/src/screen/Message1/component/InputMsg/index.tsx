import { memo, useRef, useState, useEffect, useId } from 'react';
import style from './style.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { route_enum } from '@src/router/type';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoSend } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { FaShoppingCart } from 'react-icons/fa';
import { LuNotebookPen } from 'react-icons/lu';
import { MdOutlineOndemandVideo, MdAttachFile } from 'react-icons/md';
import { PiSmileyStickerLight } from 'react-icons/pi';
import { TbTransfer } from 'react-icons/tb';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import {
    useCreateMessageV1Mutation,
    useGetLastMessageQuery,
    useVideoMessageMutation,
} from '@src/redux/query/messageV1RTK';
import { CreateMessageV1BodyField, VideoMessageBodyField } from '@src/dataStruct/message_v1/body';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { MessageImageBodyField } from '@src/dataStruct/zalo/hookData/body';
import ReplyContainer from './component/ReplyContainer';
import {
    set_repliedMessage,
    setData_toastMessage,
    set_isLoading,
    setIsShow_changeChatRoomMasterDialog,
} from '@src/redux/slice/MessageV1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { uploadAImageToZalo, uploadVideo } from '../../handle';
import { AccountField } from '@src/dataStruct/account';
// import { BASE_URL_API } from '@src/const/api/baseUrl';
import { getSocket } from '@src/socketIo';

const InputMsg = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();
    const textarea_element = useRef<HTMLTextAreaElement | null>(null);
    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const videoInput_element = useRef<HTMLInputElement | null>(null);
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.MessageV1Slice.zaloOa);
    const repliedMessage: MessageV1Field<ZaloMessageType> | undefined = useSelector(
        (state: RootState) => state.MessageV1Slice.repliedMessage
    );
    const id_imageInput = useId();
    const id_videoInput = useId();
    const [text, setText] = useState<string>('');
    const [lastMessage, setLastMessage] = useState<MessageV1Field<ZaloMessageType> | undefined>(undefined);
    const [isPlaywrightOnline, setIsPlaywrightOnline] = useState<boolean>(false);

    const [createMessageV1] = useCreateMessageV1Mutation();
    const [videoMessage] = useVideoMessageMutation();

    const {
        data: data_lastMessage,
        // isFetching,
        isLoading: isLoading_lastMessage,
        isError: isError_lastMessage,
        error: error_lastMessage,
    } = useGetLastMessageQuery({ chatRoomId: id || '' }, { skip: id === undefined });
    useEffect(() => {
        if (isError_lastMessage && error_lastMessage) {
            console.error(error_lastMessage);
        }
    }, [isError_lastMessage, error_lastMessage]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_zaloOa));
    }, [isLoading_lastMessage]);
    useEffect(() => {
        const resData = data_lastMessage;
        if (resData?.isSuccess && resData.data) {
            setLastMessage(resData.data);
        }
    }, [data_lastMessage]);

    useEffect(() => {
        if (!zaloApp || !account) return;

        let timeoutId: NodeJS.Timeout;

        const socket = getSocket();

        interface PlaywrightOnlinePayload {
            zaloAppId: number;
            accountId: number;
        }
        const playwrightOnline = (playwrightOnlinePayload: PlaywrightOnlinePayload) => {
            // console.log('Received playwrightOnline event:', playwrightOnlinePayload);
            if (!playwrightOnlinePayload) return;
            clearTimeout(timeoutId);
            setIsPlaywrightOnline(true);
            timeoutId = setTimeout(() => {
                setIsPlaywrightOnline(false);
            }, 5000);
        };

        socket.on('playwrightOnline-appOn', playwrightOnline);

        setInterval(() => {
            socket.emit('playwrightOnline-onApp', { zaloAppId: zaloApp.id, accountId: account.id });
        }, 3000);

        return () => {
            socket.off('playwrightOnline-appOn', playwrightOnline);
            clearTimeout(timeoutId);
        };
    }, [zaloApp, account]);

    const handleInput = () => {
        const el = textarea_element.current;
        if (!el) return;

        el.style.height = 'auto'; // reset
        el.style.height = el.scrollHeight + 'px'; // grow theo nội dung
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);
    };

    const handleSend = () => {
        if (!zaloApp || !zaloOa || !id) return;
        if (!lastMessage) return;

        const txt = text.trim();
        if (txt.length === 0) return;

        let u_senderId: string = '';

        const isUserSend = lastMessage.event_name.startsWith('user_send');
        const isOaSend = lastMessage.event_name.startsWith('oa_send');

        if (isUserSend) {
            u_senderId = lastMessage.sender_id;
        }

        if (isOaSend) {
            u_senderId = lastMessage.recipient_id;
        }

        const newMessage = repliedMessage?.message_id
            ? {
                  text: txt,
                  quote_message_id: repliedMessage.message_id,
              }
            : { text: txt };

        const createMessageV1Body: CreateMessageV1BodyField = {
            zaloApp: zaloApp,
            zaloOa: zaloOa,
            chatRoomId: Number(id),
            payload: {
                recipient: {
                    user_id: u_senderId,
                },
                message: newMessage,
            },
        };

        createMessageV1(createMessageV1Body)
            .then((res) => {
                const resData = res.data;
                if (!(resData?.isSuccess && resData.data)) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: resData?.message ?? 'Gửi tin nhắn không thành công !',
                        })
                    );
                }
                setText('');
                dispatch(set_repliedMessage(undefined));
            })
            .catch((err) => console.error(err));
    };

    const handleImageIconClick = () => {
        imageInput_element.current?.click();
    };

    const handleVideoIconClick = () => {
        if (!isPlaywrightOnline) return;
        videoInput_element.current?.click();
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const file = files[0];

        if (!zaloApp) return;
        if (!zaloOa) return;
        if (!id) return;
        if (!lastMessage) return;
        try {
            const res_upload = await uploadAImageToZalo(file, zaloApp, zaloOa);
            if (res_upload.error !== 0) return;
            let u_senderId: string = '';
            const isUserSend = lastMessage.event_name.startsWith('user_send');
            const isOaSend = lastMessage.event_name.startsWith('oa_send');

            if (isUserSend) {
                u_senderId = lastMessage.sender_id;
            }

            if (isOaSend) {
                u_senderId = lastMessage.recipient_id;
            }

            const newMessage: MessageImageBodyField = {
                text: '',
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'media',
                        elements: [
                            {
                                media_type: 'image',
                                attachment_id: res_upload.data.attachment_id,
                            },
                        ],
                    },
                },
            };

            const createMessageV1Body: CreateMessageV1BodyField = {
                zaloApp: zaloApp,
                zaloOa: zaloOa,
                chatRoomId: Number(id),
                payload: {
                    recipient: {
                        user_id: u_senderId,
                    },
                    message: newMessage,
                },
            };

            createMessageV1(createMessageV1Body)
                .then((res) => {
                    const resData = res.data;
                    if (!(resData?.isSuccess && resData.data)) {
                        dispatch(
                            setData_toastMessage({
                                type: messageType_enum.ERROR,
                                message: resData?.message ?? 'Gửi tin nhắn không thành công !',
                            })
                        );
                    }
                })
                .catch((err) => console.error(err));
        } catch (error) {
            console.error(error);
        }
    };

    const handleVideoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const file = files[0];

        if (!account) return;
        if (!zaloApp) return;
        if (!zaloOa) return;
        if (!lastMessage) return;

        try {
            dispatch(set_isLoading(true));
            const resData_video = await uploadVideo(file, account.id.toString());
            if (!resData_video) {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đăng tải thước phim thất bại !',
                    })
                );
                return;
            }
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.SUCCESS,
                    message: 'Đăng tải thước phim thành công !',
                })
            );
            dispatch(set_isLoading(false));

            const fileName = resData_video.fileName;
            // const videoUrl = `${BASE_URL_API}/service_video_v1/query/video/${fileName}`;
            // console.log('videoUrl', videoUrl);

            let oaId: string = '';
            let userId: string = '';
            const isUserSend = lastMessage.event_name.startsWith('user_send');
            const isOaSend = lastMessage.event_name.startsWith('oa_send');

            if (isUserSend) {
                oaId = lastMessage.recipient_id;
                userId = lastMessage.sender_id;
            }

            if (isOaSend) {
                oaId = lastMessage.sender_id;
                userId = lastMessage.recipient_id;
            }

            const videoMessageBody: VideoMessageBodyField = {
                zaloAppId: zaloApp.id,
                zaloOaId: zaloOa.id,
                chatRoomId: Number(id),
                accountId: account.id,
                videoName: fileName,
                oaId: oaId,
                userId: userId,
                userIdByApp: lastMessage.user_id_by_app,
            };

            dispatch(set_isLoading(true));
            videoMessage(videoMessageBody)
                .then((res) => {
                    const resData = res.data;
                    console.log('videoMessage', resData);
                })
                .catch((err) => {
                    console.error(err);
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Đã có lỗi xảy ra !',
                        })
                    );
                })
                .finally(() => {
                    dispatch(set_isLoading(false));
                });
        } catch (error) {
            console.error(error);
            dispatch(set_isLoading(false));
        }
    };

    const handleGoToOrder = () => {
        navigate(route_enum.ORDER, {
            state: { chatRoomId: id || '' },
        });
    };

    const handleGoToNote = () => {
        navigate(route_enum.NOTE, {
            state: { chatRoomId: id || '' },
        });
    };

    const handleOpenChangeChatRoomMaster = () => {
        dispatch(setIsShow_changeChatRoomMasterDialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.icons}>
                <div className={style.icons1}>
                    <CiImageOn id={id_imageInput} onClick={handleImageIconClick} size={20} color="green" />
                    <input
                        ref={imageInput_element}
                        onChange={handleImageChange}
                        type="file"
                        id={id_imageInput}
                        accept="image/*"
                    />
                    <MdOutlineOndemandVideo
                        id={id_videoInput}
                        onClick={handleVideoIconClick}
                        size={20}
                        color={isPlaywrightOnline ? 'red' : 'gray'}
                    />
                    <input
                        ref={videoInput_element}
                        onChange={handleVideoChange}
                        type="file"
                        id={id_videoInput}
                        accept="video/*"
                    />
                    <MdAttachFile size={20} />
                    <PiSmileyStickerLight size={20} />
                </div>
                <div className={style.icons2}>
                    <FaShoppingCart onClick={() => handleGoToOrder()} size={20} color="red" />
                    <LuNotebookPen onClick={() => handleGoToNote()} size={20} />
                    <TbTransfer onClick={() => handleOpenChangeChatRoomMaster()} size={20} />
                </div>
            </div>
            {repliedMessage && <ReplyContainer data={repliedMessage} />}
            <div className={style.textInput}>
                <div>
                    <textarea
                        value={text}
                        onChange={(e) => handleTextChange(e)}
                        ref={textarea_element}
                        rows={2}
                        placeholder="Nhắn gì đó !"
                        onInput={handleInput}
                    />
                </div>
                <div>
                    <IoSend onClick={() => handleSend()} size={25} />
                </div>
            </div>
        </div>
    );
};

export default memo(InputMsg);
