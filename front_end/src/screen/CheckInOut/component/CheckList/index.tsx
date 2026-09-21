import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { useLazyGetCheckInOutsQuery } from '@src/redux/query/checkInOutRTK';
import { CheckInOutWithDateField, CheckInOutType, CheckInOutEnum } from '@src/dataStruct/checkInOut';
import { GetMyCheckInOutsBodyField } from '@src/dataStruct/checkInOut/body';
import { set_isLoading } from '@src/redux/slice/Note';
import { AccountField } from '@src/dataStruct/account';
import { handleSrcImage } from '@src/utility/string';

interface CheckInOutGroup {
    date: string;
    items: CheckInOutWithDateField[];
}

const CheckList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [checkInOutsWithDate, setCheckInOutsWithDate] = useState<CheckInOutWithDateField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [groupedCheckInOuts, setGroupedCheckInOuts] = useState<CheckInOutGroup[]>();
    const size = 10;
    const [page, setPage] = useState<number>(1);
    const [getCheckInOuts] = useLazyGetCheckInOutsQuery();

    useEffect(() => {
        if (!account) return;

        const date = new Date();
        date.setDate(date.getDate() - (page - 1) * size);
        const dateDaysAgo = new Date(date);
        dateDaysAgo.setDate(dateDaysAgo.getDate() - (size - 1));

        const fromDate = date.toISOString().split('T')[0];
        const toDate = dateDaysAgo.toISOString().split('T')[0];

        const body: GetMyCheckInOutsBodyField = {
            fromDate: fromDate,
            toDate: toDate,
            accountId: account.id,
        };
        dispatch(set_isLoading(true));
        getCheckInOuts(body)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData?.data) {
                    if (page === 1) {
                        setCheckInOutsWithDate(resData.data);
                    } else {
                        setCheckInOutsWithDate((prev) => [...prev, ...(resData.data || [])]);
                    }
                }
            })
            .catch((error) => {
                console.log('CheckList', 'getCheckInOuts error: ', error);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [dispatch, getCheckInOuts, account, page]);

    const handleSeeMore = () => {
        if (!account) return;
        if (!hasMore) return;
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        const _groupedCheckInOuts = Object.entries(
            checkInOutsWithDate.reduce(
                (groups, item) => {
                    const date = item.date.split('T')[0];

                    if (!groups[date]) {
                        groups[date] = [];
                    }

                    groups[date].push(item);

                    return groups;
                },
                {} as Record<string, CheckInOutWithDateField[]>
            )
        ).map(([date, items]) => ({
            date,
            items,
        }));
        setGroupedCheckInOuts(_groupedCheckInOuts);
    }, [checkInOutsWithDate]);

    useEffect(() => {
        if (!groupedCheckInOuts) return;
        if (groupedCheckInOuts.length === size) {
            setHasMore(true);
        } else {
            setHasMore(false);
        }
    }, [groupedCheckInOuts]);

    const handleCheckColor = (type: CheckInOutType) => {
        switch (type) {
            case CheckInOutEnum.IN:
                return style.green;
            case CheckInOutEnum.OUT:
                return style.red;
            default:
                return '';
        }
    };

    const list_check = groupedCheckInOuts?.map((group) => (
        <div className={style.checkGroup} key={group.date}>
            <div className={style.header}>{group.date}</div>

            {group.items.map((item) => (
                <div className={style.check} key={item.id}>
                    <div>
                        <div className={handleCheckColor(item.type)}>{item.type}</div>
                        <div>{item.note}</div>
                    </div>
                    {item.image && <img src={handleSrcImage(item.image)} alt="CheckInOut" />}
                </div>
            ))}
        </div>
    ));

    return (
        <div className={style.parent}>
            {list_check}
            <div className={style.seeMore}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(CheckList);
