import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { formatMoney, formatNumber } from '@src/utility/string';
import MyChart from './component/MyChart';
import { StatisticsOaField } from '@src/dataStruct/statistics';

const Overview = () => {
    const statisticsOaArray: StatisticsOaField[] = useSelector(
        (state: RootState) => state.DashBoardSlice.statisticsOaArray
    );

    const [sales, setSales] = useState<number>(0);
    const [averageSales, setAverageSales] = useState<number>(0);
    const [orderAmount, setOrderAmount] = useState<number>(0);
    const [averageOrderAmount, setAverageOrderAmount] = useState<number>(0);

    useEffect(() => {
        if (statisticsOaArray.length > 0) {
            const totalSales = statisticsOaArray.reduce((sum, oa) => sum + oa.sales, 0);
            const totalOrderAmount = statisticsOaArray.reduce((sum, oa) => sum + oa.orderAmount, 0);
            setSales(totalSales);
            setAverageSales(totalSales / totalOrderAmount);
            setOrderAmount(totalOrderAmount);
            setAverageOrderAmount(totalOrderAmount / 2);
        }
    }, [statisticsOaArray]);

    return (
        <div className={style.parent}>
            <div>
                <div>
                    <div className={style.title}>Tổng doanh số</div>
                    <div className={style.number}>
                        <div>{formatMoney(sales)}</div>
                        <div>
                            <div>{formatMoney(averageSales)}</div>
                        </div>
                        {/* <div>{formatMoney(10000000)}</div>
                        <div>
                            <div>{formatMoney(3000000)}</div>
                        </div> */}
                    </div>
                </div>
                <div>
                    <div className={style.title}>Tổng đơn hàng</div>
                    <div className={style.number}>
                        <div>{formatNumber(orderAmount)}</div>
                        <div>
                            <div>{formatNumber(averageOrderAmount)}</div>
                        </div>
                        {/* <div>{formatNumber(100)}</div>
                        <div>
                            <div>{formatNumber(50)}</div>
                        </div> */}
                    </div>
                </div>
            </div>
            <div>
                <MyChart />
            </div>
        </div>
    );
};

export default memo(Overview);
