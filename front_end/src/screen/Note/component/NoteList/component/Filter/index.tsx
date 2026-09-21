import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { CiSearch } from 'react-icons/ci';
import { GetNotesBodyField } from '@src/dataStruct/note/body';
import { setData_toastMessage } from '@src/redux/slice/Note';
import { messageType_enum } from '@src/component/ToastMessage/type';

const Filter: FC<{ handleGetNotes: (getNotesBody: GetNotesBodyField) => void }> = ({ handleGetNotes }) => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();

    const [isDelete, setIsDelete] = useState<boolean>(true);
    const [isNotDelete, setIsNotDelete] = useState<boolean>(true);
    const [idInput, setIdInput] = useState<string>('');

    const filterBody: GetNotesBodyField = {
        page: 1,
        size: 5,
        offset: 0,
        chatRoomId: -1,
        accountId: -1,
    };

    useEffect(() => {
        const chatRoomId = location.state?.chatRoomId;
        if (!chatRoomId) return;
        setIdInput(chatRoomId);
    }, [location.state?.chatRoomId]);

    const handleIsDelete = () => {
        setIsDelete(!isDelete);
    };

    const handleIsNotDelete = () => {
        setIsNotDelete(!isNotDelete);
    };

    const handleIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIdInput(value);
    };

    const handleSearch = () => {
        const idInput_t = idInput.trim();

        if (idInput_t.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng thêm Id phòng hội thoại !',
                })
            );
            return;
        }

        const filterBody_cp = { ...filterBody };

        if (isDelete && isNotDelete) {
            filterBody_cp.isDelete = undefined;
        } else if (isDelete) {
            filterBody_cp.isDelete = true;
        } else if (isNotDelete) {
            filterBody_cp.isDelete = false;
        }

        filterBody_cp.chatRoomId = Number(idInput_t);
        handleGetNotes(filterBody_cp);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.checkbox1}>
                    <input type="checkbox" checked={isDelete} onChange={() => handleIsDelete()} />
                    <div>Đã xóa</div>
                </div>
                <div className={style.checkbox2}>
                    <input type="checkbox" checked={isNotDelete} onChange={() => handleIsNotDelete()} />
                    <div>Chưa xóa</div>
                </div>
                <div className={style.searchContainer}>
                    <input value={idInput} onChange={(e) => handleIdInput(e)} placeholder="Id phòng hội thoại" />
                    <CiSearch onClick={() => handleSearch()} size={20} />
                </div>
            </div>
        </div>
    );
};

export default memo(Filter);
