import { memo, useState, useCallback } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import Filter from './component/Filter';
import OneNote from './component/OneNote';
import { useLazy_get_Notes_Query } from '@src/redux/query/note_RTK';
import { Note_Field } from '@src/data_struct/note';
import { Get_Notes_Body_Field } from '@src/data_struct/note/body';
import { set__is_loading } from '@src/redux/slice/Note';

const NoteList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const new_notes: Note_Field[] = useSelector((state: RootState) => state.Note_Slice.new_notes);
    const [filter_body, set__filter_body] = useState<Get_Notes_Body_Field>({
        page: -1,
        size: 5,
        offset: 0,
        chat_room_id: '',
        account_id: '',
    });
    const [notes, set__notes] = useState<Note_Field[]>([]);
    const [has_more, set__has_more] = useState<boolean>(true);
    const [get_Notes] = useLazy_get_Notes_Query();

    const handle_Get_Notes = useCallback(
        (get_notes_body: Get_Notes_Body_Field) => {
            set__notes([]);
            set__has_more(true);
            set__filter_body(get_notes_body);
            dispatch(set__is_loading(true));
            get_Notes(get_notes_body)
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data?.data) {
                        set__notes(res_data.data.items);
                        set__has_more(res_data.data.items.length === get_notes_body.size);
                    }
                })
                .catch((error) => {
                    console.log('NoteList', 'getNotes error: ', error);
                })
                .finally(() => {
                    dispatch(set__is_loading(false));
                });
        },
        [dispatch, get_Notes]
    );

    const handle_See_More = () => {
        if (!has_more || filter_body.page === -1) return;
        const body: Get_Notes_Body_Field = { ...filter_body, page: filter_body.page + 1, offset: new_notes.length };
        dispatch(set__is_loading(true));
        get_Notes(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    set__notes((prev) => [...prev, ...(res_data.data?.items || [])]);
                    set__has_more(res_data.data.items.length === body.size);
                }
            })
            .catch((error) => {
                console.log('OrderList', 'getOrders error: ', error);
            })
            .finally(() => {
                dispatch(set__is_loading(false));
                set__filter_body({ ...filter_body, page: filter_body.page + 1 });
            });
    };

    const list_order = notes.map((item, index) => {
        return <OneNote key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <Filter handle_Get_Notes={handle_Get_Notes} />
            {list_order}
            <div className={style.seeMore}>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(NoteList);
