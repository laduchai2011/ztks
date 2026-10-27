import { memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoInformationSharp } from 'react-icons/io5';
import { Order_V1_Status_Enum, Order_V1_Status_Type } from '@src/data_struct/order_v1';
import { Is_Pay_Text_Color, Order_Status_Text_Color } from '@src/screen/Order_V1/util';

const Infor2 = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const [status, set_status] = useState<Order_V1_Status_Type>(Order_V1_Status_Enum.CREATED);

    useEffect(() => {
        parent_element.current?.style.setProperty('--is_pay_text_color', Is_Pay_Text_Color.Un_Pay);

        switch (status) {
            case Order_V1_Status_Enum.COMPLETED: {
                parent_element.current?.style.setProperty('--status-color', Order_Status_Text_Color.Success_Order);
                break;
            }
            case Order_V1_Status_Enum.CREATE_FAILURE: {
                parent_element.current?.style.setProperty('--status-color', Order_Status_Text_Color.Failure_Order);
                break;
            }
            case Order_V1_Status_Enum.CANCELLED: {
                parent_element.current?.style.setProperty('--status-color', Order_Status_Text_Color.Failure_Order);
                break;
            }
            default: {
                parent_element.current?.style.setProperty('--status-color', Order_Status_Text_Color.Un_Finished_Order);
                break;
            }
        }
    }, [status]);

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.infor21}>
                <div>
                    <div>
                        <IoInformationSharp />
                    </div>
                </div>
                <div>Thông tin đơn hàng</div>
            </div>
            <div className={style.infor22}>
                <div>
                    <div>Tiêu đề</div>
                    <div>sdf sdfsd sdf sdfds sd</div>
                </div>
                <div>
                    <div>Nội dung</div>
                    <div>sdf sdfsd sdf sdfds sd</div>
                </div>
            </div>
            <div className={style.infor23}>
                <div>
                    <div>
                        <div>Trạng thái</div>
                        <div>Dang tao</div>
                    </div>
                    <div>
                        <div>Thanh toán</div>
                        <div>chua thanh toan</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor2);
