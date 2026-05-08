import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { useLazyGetZnsMessagesQuery } from '@src/redux/query/zaloRTK';
import { AccountField } from '@src/dataStruct/account';
import { ZnsMessageField } from '@src/dataStruct/zalo';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/ZnsDetail';
import { messageType_enum } from '@src/component/ToastMessage/type';
import OneDay from './component/OneDay';

const ZnsMessageList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const [days, setDays] = useState<ZnsMessageField[][]>([[]]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [getZnsMessages] = useLazyGetZnsMessagesQuery();

    useEffect(() => {
        if (!account) return;
        if (!id) return;

        dispatch(set_isLoading(true));
        getZnsMessages({ page: page, size: 1, znsTemplateId: Number(id), accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    if (page === 1) {
                        setDays([resData.data]);
                    } else {
                        setDays((prev) => [...prev, resData.data ?? []]);
                    }
                    setHasMore(true);
                } else {
                    setHasMore(false);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [dispatch, getZnsMessages, account, id, page]);

    const handleSeeMore = () => {
        setPage((prev) => prev + 1);
    };

    const day_list = days.map((item, index) => {
        return <OneDay messages={item} key={index} />;
    });

    return (
        <div className={style.parent}>
            <div>{day_list}</div>
            <div className={style.seeMore}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(ZnsMessageList);
