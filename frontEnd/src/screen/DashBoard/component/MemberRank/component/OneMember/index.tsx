import { memo } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';

const OneMember = () => {
    return (
        <div className={style.parent}>
            <div className={style.infor}>
                <div className={style.index}>1</div>
                <div className={style.avatar}>
                    <img src={avatarnull} alt="avatar" />
                </div>
                <div className={style.name}>ten</div>
                <div className={style.sales}>doanh so</div>
                <div className={style.orderAmount}>don</div>
                <div className={style.orderListText}>Danh sách đơn</div>
            </div>
            <div className={style.orderList}>
                <div>
                    <div className={style.index}>1</div>
                    <div className={style.header}>header</div>
                    <div className={style.content}>content</div>
                    <div className={style.phone}>phone</div>
                    <div className={style.money}>tien</div>
                    <div className={style.pay}>pay</div>
                </div>
            </div>
        </div>
    );
};

export default memo(OneMember);
