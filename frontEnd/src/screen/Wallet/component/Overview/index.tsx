import style from './style.module.scss';
import { formatMoney } from '@src/utility/string';

const Overview = () => {
    return (
        <div className={style.parent}>
            <div className={style.money}>{formatMoney(100000)}</div>
            <div className={style.transfer}>
                <div>Chuyển tới ví</div>
                <div>Rút tiền</div>
            </div>
        </div>
    );
};

export default Overview;
