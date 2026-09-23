import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { HexColorPicker } from 'react-colorful';
import { Account_Field } from '@src/data_struct/account';
import { Chat_Room_Role_Field } from '@src/data_struct/chat_room';
import { Update_Setup_Chat_Room_Role_Body_Field } from '@src/data_struct/chat_room/body';
import { avatarnull } from '@src/utility/string';
import {
    use_get_Chat_Room_Role_With_Crid_Aaid_Query,
    use_update_Setup_Chat_Room_Role_Mutation,
} from '@src/redux/query/chat_room_RTK';
import { set__data__toast_message, set__is_loading } from '@src/redux/slice/Message_V1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { handleSrcImage } from '@src/utility/string';

const Added: FC<{ index: number; data: Account_Field }> = ({ index, data }) => {
    const default_color = '#EBEBEB';
    const dispatch = useDispatch<AppDispatch>();
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const you: string = account?.id === data.id ? 'Bạn' : '';
    const { id } = useParams<{ id: string }>();
    const [is_color_frame, set__is_color_frame] = useState<boolean>(false);
    const [is_read, set__is_read] = useState<boolean>(false);
    const [is_send, set__is_send] = useState<boolean>(false);
    const [color, set__color] = useState<string>(default_color);
    const [chat_room_role, set__chat_room_role] = useState<Chat_Room_Role_Field | undefined>(undefined);
    const [avatar_url, set__avatar_url] = useState<string>(avatarnull);

    const [update_Setup_Chat_Room_Role] = use_update_Setup_Chat_Room_Role_Mutation();

    const handle_Is_Read = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        set__is_read(checked);
    };

    const handle_Is_Send = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        set__is_send(checked);
    };

    const handle_Show_Color_Frame = () => {
        set__is_color_frame(!is_color_frame);
    };

    const {
        data: data__chat_room_role,
        // isFetching,
        isLoading: is_loading__chat_room_role,
        isError: is_error__chat_room_role,
        error: error__chat_room_role,
    } = use_get_Chat_Room_Role_With_Crid_Aaid_Query(
        { authorized_account_id: data.id, chat_room_id: id || '' },
        { skip: id === undefined }
    );
    useEffect(() => {
        if (is_error__chat_room_role && error__chat_room_role) {
            console.error(error__chat_room_role);
        }
    }, [is_error__chat_room_role, error__chat_room_role]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [is_loading__chat_room_role]);
    useEffect(() => {
        const res_data = data__chat_room_role;
        if (res_data?.is_success && res_data.data) {
            set__chat_room_role(res_data.data);
        }
    }, [data__chat_room_role]);

    useEffect(() => {
        if (!chat_room_role) return;
        set__is_read(chat_room_role.is_read);
        set__is_send(chat_room_role.is_send);
        if (chat_room_role.back_ground_color) {
            set__color(chat_room_role.back_ground_color);
        }
    }, [chat_room_role]);

    useEffect(() => {
        const _avatar_url = data.avatar ? handleSrcImage(data.avatar) : avatarnull;
        set__avatar_url(_avatar_url);
    }, [data.avatar]);

    const handle_Update = () => {
        if (!chat_room_role) return;
        if (
            chat_room_role.is_read === is_read &&
            chat_room_role.is_send === is_send &&
            chat_room_role.back_ground_color === color
        )
            return;

        const update_setup_chat_room_role_body: Update_Setup_Chat_Room_Role_Body_Field = {
            id: chat_room_role.id,
            back_ground_color: color,
            is_read: is_read,
            is_send: is_send,
            account_id: chat_room_role.account_id,
        };

        dispatch(set__is_loading(true));
        update_Setup_Chat_Room_Role(update_setup_chat_room_role_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success) {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Cập nhật thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Cập nhật thất bại !',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(set__is_loading(false)));
    };

    return (
        <div className={style.parent}>
            <div className={style.indexContainer}>{index + 1}</div>
            <div className={style.nameContainer}>
                <img src={avatar_url} alt="" />
                <div className={style.you}>{you}</div>
                <div className={style.name}>{data.first_name + ' ' + data.last_name}</div>
            </div>
            <div className={style.setupContainer}>
                <div className={style.setupMain}>
                    <div className={style.read}>
                        <input checked={is_read} onChange={(e) => handle_Is_Read(e)} type="checkbox" />
                        <div>Đọc</div>
                    </div>
                    <div className={style.send}>
                        <input checked={is_send} onChange={(e) => handle_Is_Send(e)} type="checkbox" />
                        <div>Gửi</div>
                    </div>
                    <div className={style.colorSelect}>
                        <div
                            onClick={() => handle_Show_Color_Frame()}
                            style={{
                                background: color,
                            }}
                        />
                        <div>Màu nền</div>
                        {is_color_frame && (
                            <HexColorPicker className={style.colorFrame} color={color} onChange={set__color} />
                        )}
                    </div>
                </div>
            </div>
            <div className={style.btnContainer}>
                <button onClick={() => handle_Update()}>Cập nhật</button>
            </div>
        </div>
    );
};

export default memo(Added);
