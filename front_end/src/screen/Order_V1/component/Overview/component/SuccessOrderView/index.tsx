import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { LuMoveDown, LuMoveUp } from 'react-icons/lu';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

const SuccessOrderView = () => {
    const [is_order_negative, set__is_order_negative] = useState<boolean>(true);

    const handle_Class_Name_Order_Negative = () => {
        if (is_order_negative) {
            return style.negative;
        }
        return style.positive;
    };

    return (
        <div className={style.parent}>
            <div className={style.icon_column}>
                <div className={style.icon_box}>
                    <IoIosCheckmarkCircleOutline size={25} color="white" />
                </div>
            </div>
            <div className={style.txt_column}>
                <div>Đơn hoàn thành</div>
                <div>1.000.000</div>
                <div>
                    <div className={`${handle_Class_Name_Order_Negative()}`}>
                        {!is_order_negative && <LuMoveUp />}
                        {is_order_negative && <LuMoveDown />}
                        <div>12%</div>
                    </div>

                    <div>So với tuần trước</div>
                </div>
                <div>
                    <div>
                        <LuMoveUp />
                        <div>12%</div>
                    </div>
                    <div>So với tháng trước</div>
                </div>
            </div>
        </div>
    );
};

export default memo(SuccessOrderView);
