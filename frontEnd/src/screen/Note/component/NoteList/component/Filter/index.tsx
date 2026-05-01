import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { CiSearch } from 'react-icons/ci';
import { GetNotesBodyField } from '@src/dataStruct/note/body';
import { ZaloOaField } from '@src/dataStruct/zalo';

const Filter: FC<{ handleGetNotes: (getNotesBody: GetNotesBodyField) => void }> = ({ handleGetNotes }) => {
    const location = useLocation();
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.OrderSlice.selectedOa);
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
        const filterBody_cp = { ...filterBody };
        filterBody_cp.chatRoomId = idInput_t.length > 0 ? Number(idInput_t) : undefined;
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
