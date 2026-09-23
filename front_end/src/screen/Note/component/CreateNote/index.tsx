import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import TextEditor from '@src/component/TextEditor';
import { IoCloseOutline } from 'react-icons/io5';
import { CREATE_NOTE } from '@src/const/text';
import { Create_Note_Body_Field } from '@src/data_struct/note/body';
import { set__data__toast_message, set__is_loading, set__data__add_new_note } from '@src/redux/slice/Note';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { isNumber } from '@src/utility/string';
import { use_create_Note_Mutation } from '@src/redux/query/note_RTK';

const CreateNote = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const [content, set__content] = useState<string>('');
    const [id_input, set__id_input] = useState<string>('');

    const [create_Note] = use_create_Note_Mutation();

    const [is_show_parent, set__is_show_parent] = useState(false);
    const [is_display_btn, set__is_display_btn] = useState(true);
    const [is_show_btn, set__is_show_btn] = useState(true);
    const [is_display_icon, set__is_display_icon] = useState(false);
    const [is_show_icon, set__is_show_icon] = useState(false);

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

    useEffect(() => {
        const chat_room_id = location.state?.chat_room_id;
        if (!chat_room_id) return;
        set__id_input(chat_room_id);
    }, [location.state?.chat_room_id]);

    const handle_Id_Input = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__id_input(value);
    };

    const handle_Content = (value: string) => {
        set__content(value);
    };

    const handle_Create = () => {
        const id_input_t = id_input.trim();
        if (id_input_t.length === 0) {
            dispatch(
                set__data__toast_message({ type: messageType_enum.ERROR, message: 'Id phòng hội thoại không hợp lệ !' })
            );
            return;
        } else if (!isNumber(id_input_t)) {
            dispatch(
                set__data__toast_message({ type: messageType_enum.ERROR, message: 'Id phòng hội thoại phải là 1 số !' })
            );
        }

        const create_note_body: Create_Note_Body_Field = {
            note: content,
            chat_room_id: id_input_t,
            account_id: '',
        };

        dispatch(set__is_loading(true));
        create_Note(create_note_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__data__add_new_note(res_data.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Tạo ghi chú thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: res_data?.message ?? 'Tạo ghi chú không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Tạo ghi chú không thành công !',
                    })
                );
                console.error(err);
            })
            .finally(() => {
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
                    {CREATE_NOTE}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${is_display_icon ? style.display : ''} ${is_show_icon ? style.show : ''}`}
                    onClick={() => handle_H_Icon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div>
                    <input value={id_input} onChange={(e) => handle_Id_Input(e)} placeholder="Id phòng hội thoại" />
                </div>
                <div>
                    <TextEditor onChange={(value) => handle_Content(value)} />
                </div>
                <div>
                    <div onClick={() => handle_Create()}>{CREATE_NOTE}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateNote);
