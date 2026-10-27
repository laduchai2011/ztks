import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { Order_V1_Status_Enum, Order_V1_Status_Type } from '@src/data_struct/order_v1';
import { Order_Status_Text_Color, Order_Status_Text_Background_Color } from '@src/screen/Order_V1/util';

const OneRow = () => {
    const parent_element = useRef<HTMLDivElement>(null);

    const [status, set_status] = useState<Order_V1_Status_Type>(Order_V1_Status_Enum.COMPLETED);

    useEffect(() => {
        switch (status) {
            case Order_V1_Status_Enum.COMPLETED: {
                parent_element.current?.style.setProperty(
                    '--status-background-color',
                    Order_Status_Text_Background_Color.Success_Order
                );
                parent_element.current?.style.setProperty('--status-color', Order_Status_Text_Color.Success_Order);
                break;
            }
            case Order_V1_Status_Enum.CREATE_FAILURE: {
                parent_element.current?.style.setProperty(
                    '--status-background-color',
                    Order_Status_Text_Background_Color.Failure_Order
                );
                parent_element.current?.style.setProperty('--status-color', Order_Status_Text_Color.Failure_Order);
                break;
            }
            case Order_V1_Status_Enum.CANCELLED: {
                parent_element.current?.style.setProperty(
                    '--status-background-color',
                    Order_Status_Text_Background_Color.Failure_Order
                );
                parent_element.current?.style.setProperty('--status-color', Order_Status_Text_Color.Failure_Order);
                break;
            }
            default: {
                parent_element.current?.style.setProperty(
                    '--status-background-color',
                    Order_Status_Text_Background_Color.Un_Finished_Order
                );
                parent_element.current?.style.setProperty('--status-color', Order_Status_Text_Color.Un_Finished_Order);
                break;
            }
        }
    }, [status]);

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.check}>
                <input type="checkbox" />
            </div>
            <div className={style.order_code}>MãđơnhàngMãđơnhàngMãđơnhàngMãđơnhàng</div>
            <div className={style.customer}>Khách hàng</div>
            <div className={style.phone}>Số điện thoại</div>
            <div className={style.product}>Sản phẩm</div>
            <div className={style.money}>Tổng tiền</div>
            <div className={style.status}>
                <div>Trạng thái</div>
            </div>
            <div className={style.type}>Loại đơn</div>
            <div className={style.pay}>Thanh toán</div>
            <div className={style.time}>Thời gian</div>
            <div className={style.image}>Hình ảnh</div>
            <div className={style.video}>Thước phim</div>
            <div className={style.detail}>Xem</div>
            <div className={style.sales_agent}>Nhân viên bán hàng</div>
            <div className={style.store_agent}>Nhân viên kho</div>
        </div>
    );
};

export default memo(OneRow);
