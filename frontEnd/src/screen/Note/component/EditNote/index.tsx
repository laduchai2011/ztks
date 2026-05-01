import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, CONTENT } from '@src/const/text';
import {
    setData_toastMessage,
    set_isLoading,
    set_editNoteDialog,
    setFinal_editNoteDialog,
} from '@src/redux/slice/Note';
import { messageType_enum } from '@src/component/ToastMessage/type';
import TextEditor from '@src/component/TextEditor';
import { AccountField } from '@src/dataStruct/account';
import { NoteField } from '@src/dataStruct/note';
import { UpdateNoteBodyField } from '@src/dataStruct/note/body';
import { useUpdateNoteMutation } from '@src/redux/query/noteRTK';

const EditNote = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const isShow: boolean = useSelector((state: RootState) => state.NoteSlice.editNoteDialog.isShow);
    const note: NoteField | undefined = useSelector((state: RootState) => state.NoteSlice.editNoteDialog.note);
    const [newNote, setNewNote] = useState<NoteField | undefined>(note);
    const [content, setContent] = useState<string>('');
    const [updateNote] = useUpdateNoteMutation();

    useEffect(() => {
        if (!note) return;
        setNewNote(note);
    }, [note]);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [isShow]);

    const handleClose = () => {
        dispatch(set_editNoteDialog({ isShow: false, note: undefined }));
    };

    const handleAgree = () => {
        if (!account) return;
        if (!newNote) return;

        const updateNoteBody: UpdateNoteBodyField = {
            id: newNote.id,
            note: content,
            accountId: account.id,
        };

        dispatch(set_isLoading(true));
        updateNote(updateNoteBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setFinal_editNoteDialog({ isShow: false, newNote: resData.data }));
                    dispatch(
                        setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Cập nhật thành công !' })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({ type: messageType_enum.ERROR, message: 'Cập nhật không thành công !' })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    setData_toastMessage({ type: messageType_enum.ERROR, message: 'Cập nhật không thành công !' })
                );
                console.error(err);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const handleContent = (value: string) => {
        setContent(value);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.content}>
                        <div>{CONTENT}</div>
                        <div>
                            <TextEditor value={newNote?.note} onChange={(value) => handleContent(value)} />
                        </div>
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditNote);
