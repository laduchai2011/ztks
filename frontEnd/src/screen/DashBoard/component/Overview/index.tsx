import { memo } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { formatMoney, formatNumber } from '@src/utility/string';
import MyChart from './component/MyChart';
import { StatisticsTotalField } from '@src/dataStruct/statistics';

const Overview = () => {
    const statisticsTotal: StatisticsTotalField = useSelector(
        (state: RootState) => state.DashBoardSlice.statisticsTotal
    );

    return (
        <div className={style.parent}>
            <div>
                <div>
                    <div className={style.title}>Tổng doanh số</div>
                    <div className={style.number}>
                        <div>{formatMoney(statisticsTotal.sales)}</div>
                        <div>
                            <div>{formatMoney(statisticsTotal.averageSales)}</div>
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
                        <div>{formatNumber(statisticsTotal.orderAmount)}</div>
                        <div>
                            <div>{formatNumber(statisticsTotal.averageOrderAmount)}</div>
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
