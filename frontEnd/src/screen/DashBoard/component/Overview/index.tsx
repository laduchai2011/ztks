import { memo } from 'react';
import style from './style.module.scss';
import { formatMoney, formatNumber } from '@src/utility/string';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';

const Overview = () => {
    return (
        <div className={style.parent}>
            <div>
                <div className={style.title}>Tổng doanh số</div>
                <div className={style.number}>
                    <div>{formatMoney(10000000)}</div>
                    <div>
                        <div>
                            <FaLongArrowAltDown color="red" />
                        </div>
                        <div>{formatMoney(10000000)}</div>
                    </div>
                </div>
            </div>
            <div>
                <div className={style.title}>Tổng đơn hàng</div>
                <div className={style.number}>
                    <div>{formatNumber(1000)}</div>
                    <div>
                        <div>
                            <FaLongArrowAltDown color="red" />
                        </div>
                        <div>{formatNumber(1000)}</div>
                    </div>
                </div>
            </div>
            <div>
                <div className={style.title}>Đơn hàng cao nhất</div>
                <div className={style.number}>
                    <div>{formatMoney(10000000)}</div>
                    <div>
                        <div>
                            <FaLongArrowAltDown color="red" />
                        </div>
                        <div>{formatMoney(10000000)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Overview);
