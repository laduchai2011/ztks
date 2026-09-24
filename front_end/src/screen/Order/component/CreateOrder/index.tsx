import { memo, useState } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CREATE_ORDER, TITLE } from '@src/const/text';
import { use_create_Order_Mutation } from '@src/redux/query/order_RTK';
import { Create_Order_Body_Field } from '@src/data_struct/order/body';
import { set__data__toast_message, set__is_loading, set__new_order__create_order } from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';

const CreateOrder = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();

    const [is_show_parent, set__is_show_parent] = useState<boolean>(false);
    const [is_display_btn, set__is_display_btn] = useState<boolean>(true);
    const [is_show_btn, set__is_show_btn] = useState<boolean>(true);
    const [is_display_icon, set__is_display_icon] = useState<boolean>(false);
    const [is_show_icon, set__is_show_icon] = useState<boolean>(false);
    const [chat_room_id, set__chat_room_id] = useState<string>(location.state?.chat_room_id ?? '');
    const [title, set__title] = useState<string>('');

    const [create_Order] = use_create_Order_Mutation();

    const handle_H_Btn = () => {
        set__is_show_parent(true);
        set__is_show_btn(false);
        setTimeout(() => {
            set__is_display_btn(false);
        }, 300);
        set__is_display_icon(true);
        setTimeout(() => {
            set__is_show_icon(true);
        }, 10);
    };

    const handle_H_Icon = () => {
        set__is_show_parent(false);
        set__is_show_icon(false);
        setTimeout(() => {
            set__is_display_icon(false);
        }, 300);
        set__is_display_btn(true);
        setTimeout(() => {
            set__is_show_btn(true);
        }, 10);
    };

    const handle_Chat_Room_Id = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__chat_room_id(e.target.value);
    };

    const handle_Title = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__title(e.target.value);
    };

    const handle_Create = () => {
        const label = title.trim();

        if (label.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng nhập tiêu đề !',
                })
            );
            return;
        }
        // if (isNaN(chatRoomId_num) || chatRoomId_num <= 0) {
        //     dispatch(
        //         setData_toastMessage({
        //             type: messageType_enum.ERROR,
        //             message: 'Vui lòng nhập Id phòng chat hợp lệ !',
        //         })
        //     );
        //     return;
        // }

        const body: Create_Order_Body_Field = {
            uuid: '',
            label: label,
            content: '',
            money: 0,
            phone: '',
            chat_room_id: chat_room_id.trim(),
            account_id: '',
        };
        dispatch(set__is_loading(true));
        create_Order(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_order__create_order(res_data.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: res_data.message,
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: res_data?.message || 'Tạo đơn hàng thất bại !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: err?.response?.data?.message || 'Tạo đơn hàng thất bại !',
                    })
                );
            })
            .finally(() => {
                set__title('');
                set__chat_room_id('');
                dispatch(set__is_loading(false));
            });
    };

    return (
        <div className={`${style.parent} ${is_show_parent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${is_display_btn ? style.display : ''} ${is_show_btn ? style.show : ''}`}
                    onClick={() => handle_H_Btn()}
                >
                    {CREATE_ORDER}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${is_display_icon ? style.display : ''} ${is_show_icon ? style.show : ''}`}
                    onClick={() => handle_H_Icon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div className={style.labelContainer}>
                    <div>Thêm tiêu đề dễ nhớ cho đơn hàng</div>
                </div>
                <div className={style.inputContainer}>
                    <div>
                        <div>
                            <div>Id phòng chat</div>
                            <input value={chat_room_id} onChange={(e) => handle_Chat_Room_Id(e)} />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>{TITLE}</div>
                            <input value={title} onChange={(e) => handle_Title(e)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.btnContainer}>
                <button onClick={() => handle_Create()}>{CREATE_ORDER}</button>
            </div>
        </div>
    );
};

export default memo(CreateOrder);
