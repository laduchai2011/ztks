import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, CONTENT } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__edit_note_dialog,
    set__final__edit_note_dialog,
} from '@src/redux/slice/Note';
import { messageType_enum } from '@src/component/ToastMessage/type';
import TextEditor from '@src/component/TextEditor';
import { Account_Field } from '@src/data_struct/account';
import { Note_Field } from '@src/data_struct/note';
import { Update_Note_Body_Field } from '@src/data_struct/note/body';
import { use_update_Note_Mutation } from '@src/redux/query/note_RTK';

const EditNote = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const is_show: boolean = useSelector((state: RootState) => state.Note_Slice.edit_note_dialog.is_show);
    const note: Note_Field | undefined = useSelector((state: RootState) => state.Note_Slice.edit_note_dialog.note);

    const [new_note, set__new_note] = useState<Note_Field | undefined>(note);
    const [content, set__content] = useState<string>('');
    const [update_Note] = use_update_Note_Mutation();

    useEffect(() => {
        if (!note) return;
        set__new_note(note);
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
        dispatch(set__edit_note_dialog({ is_show: false, note: undefined }));
    };

    const handle_Agree = () => {
        if (!account) return;
        if (!new_note) return;

        const update_note_body: Update_Note_Body_Field = {
            id: new_note.id,
            note: content,
            account_id: account.id,
        };

        dispatch(set__is_loading(true));
        update_Note(update_note_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__final__edit_note_dialog({ is_show: false, new_note: res_data.data }));
                    dispatch(
                        set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Cập nhật thành công !' })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Cập nhật không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    set__data__toast_message({ type: messageType_enum.ERROR, message: 'Cập nhật không thành công !' })
                );
                console.error(err);
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    const handle_Content = (value: string) => {
        set__content(value);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.content}>
                        <div>{CONTENT}</div>
                        <div>
                            <TextEditor value={new_note?.note} onChange={(value) => handle_Content(value)} />
                        </div>
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditNote);
