import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    setData_toastMessage,
    set_isLoading,
    setIsShow_deleteNoteDialog,
    setDeletedNote_deleteNoteDialog,
} from '@src/redux/slice/Note';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { NoteField } from '@src/dataStruct/note';
import { useDeleteNoteMutation } from '@src/redux/query/noteRTK';

const DeleteNoteDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isShow: boolean = useSelector((state: RootState) => state.NoteSlice.deleteNoteDialog.isShow);
    const note: NoteField | undefined = useSelector((state: RootState) => state.NoteSlice.deleteNoteDialog.note);

    const [note1, setNote1] = useState<NoteField | undefined>(undefined);

    const [deleteNote] = useDeleteNoteMutation();

    useEffect(() => {
        if (!note) return;
        setNote1(note);
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
        dispatch(setIsShow_deleteNoteDialog(false));
    };

    const handleAgree = () => {
        if (!note1) return;
        dispatch(set_isLoading(true));
        deleteNote({ id: note1.id, accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData?.data) {
                    dispatch(setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Xóa thành công !' }));
                    dispatch(setIsShow_deleteNoteDialog(false));
                    dispatch(setDeletedNote_deleteNoteDialog(resData.data));
                } else {
                    dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Xóa không thành công !' }));
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.text}>Bạn có chắc chắn muốn xóa ghi chú này không ?</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteNoteDialog);
