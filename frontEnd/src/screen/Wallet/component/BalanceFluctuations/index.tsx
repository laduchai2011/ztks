import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { DateTime } from 'luxon';
import { WalletField, BalanceFluctuationField } from '@src/dataStruct/wallet';
import { SEE_MORE } from '@src/const/text';
import { useLazyGetBalanceFluctuationsByDateQuery } from '@src/redux/query/walletRTK';
import ACluster from './component/ACluster';

const BalanceFluctuations: FC<{ wallet: WalletField }> = ({ wallet }) => {
    const [currentDate, setCurrentDate] = useState(
        new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    );
    const [clusters, setClusters] = useState<BalanceFluctuationField[][]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [getBalanceFluctuationsByDate] = useLazyGetBalanceFluctuationsByDateQuery();

    useEffect(() => {
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
                console.log('getBalanceFluctuationsByDate', resData);
                if (resData?.isSuccess && resData.data) {
                    setClusters((prev) => [...prev, resData.data ?? []]);
                    setHasMore(true);
                } else {
                    setHasMore(false);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [currentDate, getBalanceFluctuationsByDate, wallet]);

    // load ngày trước đó
    const loadPreviousDay = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 1);

        const prevDate = d.toISOString().slice(0, 10);
        setCurrentDate(prevDate);
    };

    const handleSeeMore = () => {
        loadPreviousDay();
    };

    const list_cluster = clusters.map((item1, index) => {
        return <ACluster key={index} balanceFluctuations={item1} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.list}>
                <div className={style.cluster}>{list_cluster}</div>
                {/* <ABalanceFluctuation />
                <ABalanceFluctuation /> */}
            </div>
            <div className={style.btnContainer}>
                <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>
            </div>
        </div>
    );
};

export default memo(BalanceFluctuations);
