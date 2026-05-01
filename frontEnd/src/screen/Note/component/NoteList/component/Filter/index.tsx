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

    const [isOa, setIsOa] = useState<boolean>(true);
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

    const handleIsOa = () => {
        setIsOa(!isOa);
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
        filterBody_cp.chatRoomId = Number(idInput_t);
        handleGetNotes(filterBody_cp);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div>
                    <input type="checkbox" checked={isOa} onChange={() => handleIsOa()} />
                    <div>OA</div>
                </div>
                <div>
                    <input value={idInput} onChange={(e) => handleIdInput(e)} placeholder="Id phòng hội thoại" />
                    <CiSearch onClick={() => handleSearch()} size={20} />
                </div>
            </div>
        </div>
    );
};

export default memo(Filter);
