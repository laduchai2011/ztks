import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { Note_Field } from '@src/data_struct/note';
import {
    set__edit_note_dialog,
    set__note__delete_note_dialog,
    set__is_show__delete_note_dialog,
} from '@src/redux/slice/Note';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { timeAgoSmart } from '@src/utility/time';

const OneNote: FC<{ index: number; data: Note_Field }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const new_note: Note_Field | undefined = useSelector(
        (state: RootState) => state.Note_Slice.edit_note_dialog.new_note
    );
    const deleted_note: Note_Field | undefined = useSelector(
        (state: RootState) => state.Note_Slice.delete_note_dialog.deleted_note
    );

    const [note, set__note] = useState<Note_Field>(data);

    useEffect(() => {
        if (!new_note) return;
        if (new_note.id === note.id) {
            set__note(new_note);
        }
    }, [new_note, note]);

    useEffect(() => {
        if (!deleted_note) return;
        if (deleted_note.id === note.id) {
            set__note(deleted_note);
        }
    }, [deleted_note, note]);

    const handle_Open_Edit = () => {
        dispatch(set__edit_note_dialog({ is_show: true, note: note }));
    };

    const handle_Open_Delete = () => {
        if (note.is_delete) return;
        dispatch(set__is_show__delete_note_dialog(true));
        dispatch(set__note__delete_note_dialog(note));
    };

    const handle_Delete_Color = () => {
        if (note.is_delete) {
            return 'gray';
        }
        return 'red';
    };

    return (
        <div className={style.parent}>
            <div className={style.index}>
                <div>{index}</div>
                <div>
                    <CiEdit onClick={() => handle_Open_Edit()} size={22} color="green" />
                    <MdDelete onClick={() => handle_Open_Delete()} size={22} color={handle_Delete_Color()} />
                </div>
            </div>
            <div>
                <div dangerouslySetInnerHTML={{ __html: note.note }} />
            </div>
            <div className={style.time}>{timeAgoSmart(note.create_time)}</div>
        </div>
    );
};

export default memo(OneNote);
