import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { NoteField } from '@src/dataStruct/note';
import { set_editNoteDialog } from '@src/redux/slice/Note';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { timeAgoSmart } from '@src/utility/time';

const OneNote: FC<{ index: number; data: NoteField }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const newNote: NoteField | undefined = useSelector((state: RootState) => state.NoteSlice.editNoteDialog.newNote);
    const [note, setNote] = useState<NoteField>(data);

    useEffect(() => {
        if (!newNote) return;
        if (newNote.id === note.id) {
            setNote(newNote);
        }
    }, [newNote, note]);

    const handleOpenEdit = () => {
        dispatch(set_editNoteDialog({ isShow: true, note: note }));
    };

    return (
        <div className={style.parent}>
            <div className={style.index}>
                <div>{index}</div>
                <div>
                    <CiEdit onClick={() => handleOpenEdit()} size={22} color="green" />
                    <MdDelete size={22} color="red" />
                </div>
            </div>
            <div>
                <div dangerouslySetInnerHTML={{ __html: note.note }} />
            </div>
            <div className={style.time}>{timeAgoSmart(note.createTime)}</div>
        </div>
    );
};

export default memo(OneNote);
