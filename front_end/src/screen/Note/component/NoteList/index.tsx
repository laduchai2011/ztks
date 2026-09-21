import { memo, useState, useCallback } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import Filter from './component/Filter';
import OneNote from './component/OneNote';
import { useLazyGetNotesQuery } from '@src/redux/query/noteRTK';
import { NoteField } from '@src/dataStruct/note';
import { GetNotesBodyField } from '@src/dataStruct/note/body';
import { set_isLoading } from '@src/redux/slice/Note';

const NoteList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const newNotes: NoteField[] = useSelector((state: RootState) => state.NoteSlice.newNotes);
    const [filterBody, setFilterBody] = useState<GetNotesBodyField>({
        page: -1,
        size: 5,
        offset: 0,
        chatRoomId: -1,
        accountId: -1,
    });
    const [notes, setNotes] = useState<NoteField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [getNotes] = useLazyGetNotesQuery();

    const handleGetNotes = useCallback(
        (getNotesBody: GetNotesBodyField) => {
            setNotes([]);
            setHasMore(true);
            setFilterBody(getNotesBody);
            dispatch(set_isLoading(true));
            getNotes(getNotesBody)
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData?.data) {
                        setNotes(resData.data.items);
                        setHasMore(resData.data.items.length === getNotesBody.size);
                    }
                })
                .catch((error) => {
                    console.log('NoteList', 'getNotes error: ', error);
                })
                .finally(() => {
                    dispatch(set_isLoading(false));
                });
        },
        [dispatch, getNotes]
    );

    const handleSeeMore = () => {
        if (!hasMore || filterBody.page === -1) return;
        const body: GetNotesBodyField = { ...filterBody, page: filterBody.page + 1, offset: newNotes.length };
        dispatch(set_isLoading(true));
        getNotes(body)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData?.data) {
                    setNotes((prev) => [...prev, ...(resData.data?.items || [])]);
                    setHasMore(resData.data.items.length === body.size);
                }
            })
            .catch((error) => {
                console.log('OrderList', 'getOrders error: ', error);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
                setFilterBody({ ...filterBody, page: filterBody.page + 1 });
            });
    };

    const list_order = notes.map((item, index) => {
        return <OneNote key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <Filter handleGetNotes={handleGetNotes} />
            {list_order}
            <div className={style.seeMore}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(NoteList);
