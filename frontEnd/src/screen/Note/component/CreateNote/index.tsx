import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import TextEditor from '@src/component/TextEditor';
import { IoCloseOutline } from 'react-icons/io5';
import { CREATE_NOTE } from '@src/const/text';
import { CreateNoteBodyField } from '@src/dataStruct/note/body';
import { setData_toastMessage, set_isLoading, setData_addNewNote } from '@src/redux/slice/Note';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { isNumber } from '@src/utility/string';
import { useCreateNoteMutation } from '@src/redux/query/noteRTK';

const CreateNote = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const [content, setContent] = useState<string>('');
    const [idInput, setIdInput] = useState<string>('');

    const [createNote] = useCreateNoteMutation();

    const [isShowParent, setIsShowParent] = useState(false);
    const [isDisplayBtn, setIsDisplayBtn] = useState(true);
    const [isShowBtn, setIsShowBtn] = useState(true);
    const [isDisplayIcon, setIsDisplayIcon] = useState(false);
    const [isShowIcon, setIsShowIcon] = useState(false);

    const handleHBtn = () => {
        setIsShowParent(true);
        setIsShowBtn(false);
        setTimeout(() => {
            setIsDisplayBtn(false);
        }, 300);
        setIsDisplayIcon(true);
        setTimeout(() => {
            setIsShowIcon(true);
        }, 10);
    };

    const handleHIcon = () => {
        setIsShowParent(false);
        setIsShowIcon(false);
        setTimeout(() => {
            setIsDisplayIcon(false);
        }, 300);
        setIsDisplayBtn(true);
        setTimeout(() => {
            setIsShowBtn(true);
        }, 10);
    };

    useEffect(() => {
        const chatRoomId = location.state?.chatRoomId;
        if (!chatRoomId) return;
        setIdInput(chatRoomId);
    }, [location.state?.chatRoomId]);

    const handleIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIdInput(value);
    };

    const handleContent = (value: string) => {
        setContent(value);
    };

    const handleCreate = () => {
        const idInput_t = idInput.trim();
        if (idInput_t.length === 0) {
            dispatch(
                setData_toastMessage({ type: messageType_enum.ERROR, message: 'Id phòng hội thoại không hợp lệ !' })
            );
            return;
        } else if (!isNumber(idInput_t)) {
            dispatch(
                setData_toastMessage({ type: messageType_enum.ERROR, message: 'Id phòng hội thoại phải là 1 số !' })
            );
        }

        const createNoteBody: CreateNoteBodyField = {
            note: content,
            chatRoomId: Number(idInput_t),
            accountId: -1,
        };
        dispatch(set_isLoading(true));
        createNote(createNoteBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setData_addNewNote(resData.data));
                    dispatch(
                        setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Tạo ghi chú thành công !' })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: resData?.message ?? 'Tạo ghi chú không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    setData_toastMessage({ type: messageType_enum.ERROR, message: 'Tạo ghi chú không thành công !' })
                );
                console.error(err);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={`${style.parent} ${isShowParent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${isDisplayBtn ? style.display : ''} ${isShowBtn ? style.show : ''}`}
                    onClick={() => handleHBtn()}
                >
                    {CREATE_NOTE}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${isDisplayIcon ? style.display : ''} ${isShowIcon ? style.show : ''}`}
                    onClick={() => handleHIcon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div>
                    <input value={idInput} onChange={(e) => handleIdInput(e)} placeholder="Id phòng hội thoại" />
                </div>
                <div>
                    <TextEditor onChange={(value) => handleContent(value)} />
                </div>
                <div>
                    <div onClick={() => handleCreate()}>{CREATE_NOTE}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateNote);
