import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { DateTime } from 'luxon';
import { WalletField, BalanceFluctuationField } from '@src/dataStruct/wallet';
import { SEE_MORE } from '@src/const/text';
import {
    useLazyGetBalanceFluctuationsByDateQuery,
    useLazyGetBalanceFluctuationLatestDayQuery,
} from '@src/redux/query/walletRTK';
import ACluster from './component/ACluster';

const BalanceFluctuations: FC<{ wallet: WalletField }> = ({ wallet }) => {
    // const [currentDate, setCurrentDate] = useState(
    //     new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    // );
    const [init, setInit] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<string | null>(null);
    const [currentDates, setCurrentDates] = useState<string[]>([]);
    const [clusters, setClusters] = useState<BalanceFluctuationField[][]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [getBalanceFluctuationLatestDay] = useLazyGetBalanceFluctuationLatestDayQuery();
    const [getBalanceFluctuationsByDate] = useLazyGetBalanceFluctuationsByDateQuery();

    useEffect(() => {
        setInit(false);
        setCurrentDate(null);
        setCurrentDates([]);
        setClusters([]);
        setHasMore(true);
    }, [wallet]);

    useEffect(() => {
        if (currentDate) {
            if (!init) return;

            const getDateRangeVN = (date: string) => {
                const zone = 'Asia/Ho_Chi_Minh';

                const fromDate = DateTime.fromISO(date, { zone }).startOf('day').toUTC().toISO();

                const toDate = DateTime.fromISO(date, { zone }).plus({ days: 1 }).startOf('day').toUTC().toISO();

                return { fromDate, toDate };
            };
            const { fromDate, toDate } = getDateRangeVN(currentDate);

            if (!fromDate || !toDate) return;

            getBalanceFluctuationsByDate({
                walletId: wallet.id,
                type: null,
                fromDate: fromDate,
                toDate: toDate,
            })
                .then((res) => {
                    const resData = res.data;
                    // console.log(resData);
                    if (resData?.isSuccess && resData.data) {
                        setClusters((prev) => [...prev, resData.data ?? []]);
                        setCurrentDates((prev) => [...prev, currentDate]);
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            getBalanceFluctuationLatestDay({
                walletId: wallet.id,
                type: null,
            })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        setClusters([resData.data]);
                        // console.log(resData.data[0].createTime, 1111, new Date().toISOString().slice(0, 10));
                        const createTime = resData.data[0].createTime;
                        const date = new Date(createTime);
                        const dateOnlyVN = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
                        setCurrentDates((prev) => [...prev, dateOnlyVN]);
                        setCurrentDate(dateOnlyVN);
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [currentDate, getBalanceFluctuationsByDate, getBalanceFluctuationLatestDay, wallet, init]);

    // load ngày trước đó
    const loadPreviousDay = () => {
        if (!currentDate) return;
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 1);

        const prevDate = d.toISOString().slice(0, 10);
        setCurrentDate(prevDate);
        setInit(true);
    };

    const handleSeeMore = () => {
        if (!hasMore) return;
        loadPreviousDay();
    };

    const list_cluster = clusters.map((item, index) => {
        return <ACluster key={index} balanceFluctuations={item} currentDate={currentDates[index]} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.list}>
                <div className={style.cluster}>{list_cluster}</div>
            </div>
            <div className={style.btnContainer}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(BalanceFluctuations);
