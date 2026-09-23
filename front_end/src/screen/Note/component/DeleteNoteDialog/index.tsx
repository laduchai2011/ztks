import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__is_show__delete_note_dialog,
    set__deleted_note__delete_note_dialog,
} from '@src/redux/slice/Note';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Note_Field } from '@src/data_struct/note';
import { use_delete_Note_Mutation } from '@src/redux/query/note_RTK';

const DeleteNoteDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const is_show: boolean = useSelector((state: RootState) => state.Note_Slice.delete_note_dialog.is_show);
    const note: Note_Field | undefined = useSelector((state: RootState) => state.Note_Slice.delete_note_dialog.note);

    const [note1, set__note1] = useState<Note_Field | undefined>(undefined);

    const [delete_Note] = use_delete_Note_Mutation();

    useEffect(() => {
        if (!note) return;
        set__note1(note);
    }, [note]);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
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
    }, [is_show]);

    const handle_Close = () => {
        dispatch(set__is_show__delete_note_dialog(false));
    };

    const handle_Agree = () => {
        if (!note1) return;
        dispatch(set__is_loading(true));
        delete_Note({ id: note1.id, account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    dispatch(set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Xóa thành công !' }));
                    dispatch(set__is_show__delete_note_dialog(false));
                    dispatch(set__deleted_note__delete_note_dialog(res_data.data));
                } else {
                    dispatch(
                        set__data__toast_message({ type: messageType_enum.ERROR, message: 'Xóa không thành công !' })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.text}>Bạn có chắc chắn muốn xóa ghi chú này không ?</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteNoteDialog);
