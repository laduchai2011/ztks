import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';

const OneRow = () => {
    return (
        <div className={style.parent}>
            <div className={style.check}>
                <input type="checkbox" />
            </div>
            <div className={style.order_code}>MãđơnhàngMãđơnhàngMãđơnhàngMãđơnhàng</div>
            <div className={style.customer}>Khách hàng</div>
            <div className={style.phone}>Số điện thoại</div>
            <div className={style.product}>Sản phẩm</div>
            <div className={style.money}>Tổng tiền</div>
            <div className={style.status}>Trạng thái</div>
            <div className={style.type}>Loại đơn</div>
            <div className={style.pay}>Thanh toán</div>
            <div className={style.time}>Thời gian</div>
            <div className={style.image}>Hình ảnh</div>
            <div className={style.video}>Thước phim</div>
            <div className={style.detail}>Chi tiết</div>
            <div className={style.sales_agent}>Nhân viên bán hàng</div>
            <div className={style.store_agent}>Nhân viên kho</div>
        </div>
    );
};

export default memo(OneRow);
