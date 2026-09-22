import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { formatMoney, formatNumber } from '@src/utility/string';
import MyChart from './component/MyChart';
import { Statistics_Oa_Field } from '@src/data_struct/statistics';

const Overview = () => {
    const statistics_oa_array: Statistics_Oa_Field[] = useSelector(
        (state: RootState) => state.Dash_Board_Slice.statistics_oa_array
    );

    const [sales, set__sales] = useState<number>(0);
    const [average_sales, set__average_sales] = useState<number>(0);
    const [order_amount, set__order_amount] = useState<number>(0);
    const [average_order_amount, set__average_order_amount] = useState<number>(0);

    useEffect(() => {
        if (statistics_oa_array.length > 0) {
            const total_sales = statistics_oa_array.reduce((sum, oa) => sum + oa.sales, 0);
            const total_order_amount = statistics_oa_array.reduce((sum, oa) => sum + oa.order_amount, 0);
            set__sales(total_sales);
            set__average_sales(total_sales / total_order_amount);
            set__order_amount(total_order_amount);
            set__average_order_amount(total_order_amount / 2);
        }
    }, [statistics_oa_array]);

    return (
        <div className={style.parent}>
            <div>
                <div>
                    <div className={style.title}>Tổng doanh số</div>
                    <div className={style.number}>
                        <div>{formatMoney(sales)}</div>
                        <div>
                            <div>{formatMoney(average_sales)}</div>
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
                        <div>{formatNumber(order_amount)}</div>
                        <div>
                            <div>{formatNumber(average_order_amount)}</div>
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
