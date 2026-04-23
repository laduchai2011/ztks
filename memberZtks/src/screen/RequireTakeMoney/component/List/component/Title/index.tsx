import { memo } from 'react';
import style from './style.module.scss';

const Title = () => {
    return (
        <div className={style.parent}>
            <div className={style.overview}>
                <div className={style.index}>Stt</div>
                <div className={style.money}>Tiền</div>
                <div className={style.account}>Tài khoản</div>
                <div className={style.isDo}>Đã chuyển</div>
                <div className={style.doTime}>Thời gian chuyển</div>
                <div className={style.btn}>Nhận</div>
            </div>
        </div>
    );
};

export default memo(Title);
