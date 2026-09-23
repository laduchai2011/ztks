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
import { IoIosCall } from 'react-icons/io';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import {
    use_create_Message_V1_Mutation,
    use_get_Last_Message_Query,
    use_video_Message_Mutation,
} from '@src/redux/query/message_v1_RTK';
import { Create_Message_V1_Body_Field, Video_Message_Body_Field } from '@src/data_struct/message_v1/body';
import { Message_V1_Field, Call_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type, Zalo_Call_Type } from '@src/data_struct/zalo/hook_data';
import { Message_Image_Body_Field } from '@src/data_struct/zalo/hook_data/body';
import ReplyContainer from './component/ReplyContainer';
import {
    set__replied_message,
    set__data__toast_message,
    set__is_loading,
    set__is_show__change_chat_room_master_dialog,
} from '@src/redux/slice/Message_V1';
import { set__is_show__call_dialog, set__uid__call_dialog, set__chat_room_id__call_dialog } from '@src/redux/slice/App';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { uploadAImageToZalo, uploadVideo } from '../../handle';
import { Account_Field } from '@src/data_struct/account';
// import { BASE_URL_API } from '@src/const/api/baseUrl';
import { get_Socket } from '@src/socketIo';
// import { Zalo_Event_Name_Enum } from '@src/dataStruct/zalo/hookData/common';

const InputMsg = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const textarea_element = useRef<HTMLTextAreaElement | null>(null);
    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const videoInput_element = useRef<HTMLInputElement | null>(null);

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const zalo_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Message_V1_Slice.zalo_oa);
    const replied_message: Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type> | undefined =
        useSelector((state: RootState) => state.Message_V1_Slice.replied_message);
    const id_image_input = useId();
    const id_video_input = useId();
    const [text, set__text] = useState<string>('');
    const [last_message, set__last_message] = useState<
        Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type> | undefined
    >(undefined);
    const [is_playwright_online, set__is_playwright_online] = useState<boolean>(false);

    const [create_Message_V1] = use_create_Message_V1_Mutation();
    const [video_Message] = use_video_Message_Mutation();

    const {
        data: data__last_message,
        // isFetching,
        isLoading: is_loading__last_message,
        isError: is_error__last_message,
        error: error__last_message,
    } = use_get_Last_Message_Query({ chat_room_id: id || '' }, { skip: id === undefined });
    useEffect(() => {
        if (is_error__last_message && error__last_message) {
            console.error(error__last_message);
        }
    }, [is_error__last_message, error__last_message]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_zaloOa));
    }, [is_loading__last_message]);
    useEffect(() => {
        const res_data = data__last_message;
        if (res_data?.is_success && res_data.data) {
            set__last_message(res_data.data);
        }
    }, [data__last_message]);

    useEffect(() => {
        if (!zalo_app || !account) return;

        let timeout_id: NodeJS.Timeout;

        const socket = get_Socket();

        interface Playwright_Online_Payload_Field {
            zalo_app_id: string;
            account_id: string;
        }
        const playwright_Online = (playwright_online_payload: Playwright_Online_Payload_Field) => {
            if (!playwright_online_payload) return;
            clearTimeout(timeout_id);
            set__is_playwright_online(true);
            timeout_id = setTimeout(() => {
                set__is_playwright_online(false);
            }, 5000);
        };

        socket.on('playwrightOnline-appOn', playwright_Online);

        setInterval(() => {
            socket.emit('playwrightOnline-onApp', { zalo_app_id: zalo_app.id, account_id: account.id });
        }, 3000);

        return () => {
            socket.off('playwrightOnline-appOn', playwright_Online);
            clearTimeout(timeout_id);
        };
    }, [zalo_app, account]);

    const handle_Input = () => {
        const el = textarea_element.current;
        if (!el) return;

        el.style.height = 'auto'; // reset
        el.style.height = el.scrollHeight + 'px'; // grow theo nội dung
    };

    const handle_Text_Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        set__text(value);
    };

    const handle_Send = () => {
        if (!zalo_app || !zalo_oa || !id) return;
        if (!last_message) return;

        const txt = text.trim();
        if (txt.length === 0) return;

        let u_sender_id: string = '';

        const is_user_send = last_message.event_name.startsWith('user_send');
        const is_oa_send = last_message.event_name.startsWith('oa_send');

        if ('call_id' in last_message) {
            u_sender_id = last_message.user_id;
        } else {
            if (is_user_send) {
                u_sender_id = last_message.sender_id;
            }

            if (is_oa_send) {
                u_sender_id = last_message.recipient_id;
            }
        }

        if (replied_message && 'call_id' in replied_message) {
            //
        } else {
            const newMessage = replied_message?.message_id
                ? {
                      text: txt,
                      quote_message_id: replied_message.message_id,
                  }
                : { text: txt };

            const create_message_v1_body: Create_Message_V1_Body_Field = {
                zalo_app: zalo_app,
                zalo_oa: zalo_oa,
                chat_room_id: id,
                payload: {
                    recipient: {
                        user_id: u_sender_id,
                    },
                    message: newMessage,
                },
            };

            create_Message_V1(create_message_v1_body)
                .then((res) => {
                    const res_data = res.data;
                    if (!(res_data?.is_success && res_data.data)) {
                        dispatch(
                            set__data__toast_message({
                                type: messageType_enum.ERROR,
                                message: res_data?.message ?? 'Gửi tin nhắn không thành công !',
                            })
                        );
                    }
                    set__text('');
                    dispatch(set__replied_message(undefined));
                })
                .catch((err) => console.error(err));
        }
    };

    const handle_Image_Icon_Click = () => {
        imageInput_element.current?.click();
    };

    const handle_Video_Icon_Click = () => {
        if (!is_playwright_online) return;
        videoInput_element.current?.click();
    };

    const handle_Image_Change = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const file = files[0];

        if (!zalo_app) return;
        if (!zalo_oa) return;
        if (!id) return;
        if (!last_message) return;
        try {
            const res_upload = await uploadAImageToZalo(file, zalo_app, zalo_oa);
            if (res_upload.error !== 0) return;
            let u_sender_id: string = '';
            const is_user_send = last_message.event_name.startsWith('user_send');
            const is_oa_send = last_message.event_name.startsWith('oa_send');

            if ('call_id' in last_message) {
                u_sender_id = last_message.user_id;
            } else {
                if (is_user_send) {
                    u_sender_id = last_message.sender_id;
                }

                if (is_oa_send) {
                    u_sender_id = last_message.recipient_id;
                }
            }

            const new_message: Message_Image_Body_Field = {
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

            const create_message_v1_body: Create_Message_V1_Body_Field = {
                zalo_app: zalo_app,
                zalo_oa: zalo_oa,
                chat_room_id: id,
                payload: {
                    recipient: {
                        user_id: u_sender_id,
                    },
                    message: new_message,
                },
            };

            create_Message_V1(create_message_v1_body)
                .then((res) => {
                    const res_data = res.data;
                    if (!(res_data?.is_success && res_data.data)) {
                        dispatch(
                            set__data__toast_message({
                                type: messageType_enum.ERROR,
                                message: res_data?.message ?? 'Gửi tin nhắn không thành công !',
                            })
                        );
                    }
                })
                .catch((err) => console.error(err));
        } catch (error) {
            console.error(error);
        }
    };

    const handle_Video_Change = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const file = files[0];

        if (!account) return;
        if (!zalo_app) return;
        if (!zalo_oa) return;
        if (!last_message) return;
        if (!id) return;

        try {
            dispatch(set__is_loading(true));
            const res_data_video = await uploadVideo(file, account.id);
            if (!res_data_video) {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đăng tải thước phim thất bại !',
                    })
                );
                return;
            }
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.SUCCESS,
                    message: 'Đăng tải thước phim thành công !',
                })
            );
            dispatch(set__is_loading(false));

            const file_name = res_data_video.file_name;
            // const videoUrl = `${BASE_URL_API}/service_video_v1/query/video/${fileName}`;
            // console.log('videoUrl', videoUrl);

            let oa_id: string = '';
            let user_id: string = '';
            const is_user_send = last_message.event_name.startsWith('user_send');
            const is_oa_send = last_message.event_name.startsWith('oa_send');

            if ('call_id' in last_message) {
                oa_id = last_message.oa_id;
                user_id = last_message.user_id;
            } else {
                if (is_user_send) {
                    oa_id = last_message.recipient_id;
                    user_id = last_message.sender_id;
                }

                if (is_oa_send) {
                    oa_id = last_message.sender_id;
                    user_id = last_message.recipient_id;
                }
            }

            const video_message_body: Video_Message_Body_Field = {
                zalo_app_id: zalo_app.id,
                zalo_oa_id: zalo_oa.id,
                chat_room_id: id,
                account_id: account.id,
                video_name: file_name,
                oa_id: oa_id,
                user_id: user_id,
                user_id_by_app: last_message.user_id_by_app,
            };

            dispatch(set__is_loading(true));
            video_Message(video_message_body)
                .then((res) => {
                    const res_data = res.data;
                    console.log('videoMessage', res_data);
                })
                .catch((err) => {
                    console.error(err);
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Đã có lỗi xảy ra !',
                        })
                    );
                })
                .finally(() => {
                    dispatch(set__is_loading(false));
                });
        } catch (error) {
            console.error(error);
            dispatch(set__is_loading(false));
        }
    };

    const handle_Open_Call = () => {
        if (!id) return;
        if (!last_message) return;

        let u_sender_id: string = '';
        const is_user_send = last_message.event_name.startsWith('user_send');
        const is_oa_send = last_message.event_name.startsWith('oa_send');

        if ('call_id' in last_message) {
            u_sender_id = last_message.user_id;
        } else {
            if (is_user_send) {
                u_sender_id = last_message.sender_id;
            }

            if (is_oa_send) {
                u_sender_id = last_message.recipient_id;
            }
        }
        // dispatch(set_calling({ is: true, uid: u_senderId, chatRoomId: Number(id) }));
        dispatch(set__is_show__call_dialog(true));
        dispatch(set__uid__call_dialog(u_sender_id));
        dispatch(set__chat_room_id__call_dialog(id));
    };

    const handle_Go_To_Order = () => {
        navigate(route_enum.ORDER, {
            state: { chat_room_id: id || '' },
        });
    };

    const handle_Go_To_Note = () => {
        navigate(route_enum.NOTE, {
            state: { chat_room_id: id || '' },
        });
    };

    const handle_Open_Change_Chat_Room_Master = () => {
        dispatch(set__is_show__change_chat_room_master_dialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.icons}>
                <div className={style.icons1}>
                    <CiImageOn id={id_image_input} onClick={handle_Image_Icon_Click} size={20} color="green" />
                    <input
                        ref={imageInput_element}
                        onChange={handle_Image_Change}
                        type="file"
                        id={id_image_input}
                        accept="image/*"
                    />
                    <MdOutlineOndemandVideo
                        id={id_video_input}
                        onClick={handle_Video_Icon_Click}
                        size={20}
                        color={is_playwright_online ? 'red' : 'gray'}
                    />
                    <input
                        ref={videoInput_element}
                        onChange={handle_Video_Change}
                        type="file"
                        id={id_video_input}
                        accept="video/*"
                    />
                    <MdAttachFile size={20} />
                    <PiSmileyStickerLight size={20} />
                    <IoIosCall onClick={() => handle_Open_Call()} size={20} />
                </div>
                <div className={style.icons2}>
                    <FaShoppingCart onClick={() => handle_Go_To_Order()} size={20} color="red" />
                    <LuNotebookPen onClick={() => handle_Go_To_Note()} size={20} />
                    <TbTransfer onClick={() => handle_Open_Change_Chat_Room_Master()} size={20} />
                </div>
            </div>
            {replied_message && !('call_id' in replied_message) && <ReplyContainer data={replied_message} />}
            <div className={style.textInput}>
                <div>
                    <textarea
                        value={text}
                        onChange={(e) => handle_Text_Change(e)}
                        ref={textarea_element}
                        rows={2}
                        placeholder="Nhắn gì đó !"
                        onInput={handle_Input}
                    />
                </div>
                <div>
                    <IoSend onClick={() => handle_Send()} size={25} />
                </div>
            </div>
        </div>
    );
};

export default memo(InputMsg);
