import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { CiSearch } from 'react-icons/ci';
import { Get_Notes_Body_Field } from '@src/data_struct/note/body';
import { set__data__toast_message } from '@src/redux/slice/Note';
import { messageType_enum } from '@src/component/ToastMessage/type';

const Filter: FC<{ handle_Get_Notes: (get_notes_body: Get_Notes_Body_Field) => void }> = ({ handle_Get_Notes }) => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();

    const [is_delete, set__is_delete] = useState<boolean>(true);
    const [is_not_delete, set__is_not_delete] = useState<boolean>(true);
    const [id_input, set__id_input] = useState<string>('');

    const filter_body: Get_Notes_Body_Field = {
        page: 1,
        size: 5,
        offset: 0,
        chat_room_id: '',
        account_id: '',
    };

    useEffect(() => {
        const chat_room_id = location.state?.chat_room_id;
        if (!chat_room_id) return;
        set__id_input(chat_room_id);
    }, [location.state?.chat_room_id]);

    const handle_Is_Delete = () => {
        set__is_delete(!is_delete);
    };

    const handle_Is_Not_Delete = () => {
        set__is_not_delete(!is_not_delete);
    };

    const handle_Id_Input = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__id_input(value);
    };

    const handleSearch = () => {
        const id_input_t = id_input.trim();

        if (id_input_t.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng thêm Id phòng hội thoại !',
                })
            );
            return;
        }

        const filter_body_cp = { ...filter_body };

        if (is_delete && is_not_delete) {
            filter_body_cp.is_delete = undefined;
        } else if (is_delete) {
            filter_body_cp.is_delete = true;
        } else if (is_not_delete) {
            filter_body_cp.is_delete = false;
        }

        filter_body_cp.chat_room_id = id_input_t;
        handle_Get_Notes(filter_body_cp);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.checkbox1}>
                    <input type="checkbox" checked={is_delete} onChange={() => handle_Is_Delete()} />
                    <div>Đã xóa</div>
                </div>
                <div className={style.checkbox2}>
                    <input type="checkbox" checked={is_not_delete} onChange={() => handle_Is_Not_Delete()} />
                    <div>Chưa xóa</div>
                </div>
                <div className={style.searchContainer}>
                    <input value={id_input} onChange={(e) => handle_Id_Input(e)} placeholder="Id phòng hội thoại" />
                    <CiSearch onClick={() => handleSearch()} size={20} />
                </div>
            </div>
        </div>
    );
};

export default memo(Filter);
