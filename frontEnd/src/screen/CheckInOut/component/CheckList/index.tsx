import { memo, useState, useCallback } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { useLazyGetCheckInOutsQuery } from '@src/redux/query/checkInOutRTK';
import { CheckInOutField } from '@src/dataStruct/checkInOut';
import { GetMyCheckInOutsBodyField } from '@src/dataStruct/checkInOut/body';
import { set_isLoading } from '@src/redux/slice/Note';
import { AccountField } from '@src/dataStruct/account';

const CheckList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [checkInOuts, setCheckInOuts] = useState<CheckInOutField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [getCheckInOuts] = useLazyGetCheckInOutsQuery();

    const today = new Date();

    const fromDate = today.toISOString().split('T')[0];

    const date10DaysAgo = new Date(today);
    date10DaysAgo.setDate(date10DaysAgo.getDate() - 10);

    const toDate = date10DaysAgo.toISOString().split('T')[0];

    const handleSeeMore = () => {
        if (!account) return;

        const body: GetMyCheckInOutsBodyField = {
            fromDate: fromDate,
            toDate: toDate,
            accountId: account.id,
        };
        dispatch(set_isLoading(true));
        getCheckInOuts(body)
            .then((res) => {
                const resData = res.data;
                console.log('CheckList', 'getCheckInOuts resData: ', resData);
                if (resData?.isSuccess && resData?.data) {
                    setCheckInOuts((prev) => [...prev, ...(resData.data || [])]);
                    // setHasMore(resData.data.items.length === body.size);
                }
            })
            .catch((error) => {
                console.log('CheckList', 'getCheckInOuts error: ', error);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const list_order = checkInOuts.map((item, index) => {
        return <div></div>;
    });

    return (
        <div className={style.parent}>
            {list_order}
            <div className={style.seeMore}>
                <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>
            </div>
        </div>
    );
};

export default memo(CheckList);
