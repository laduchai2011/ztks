import { memo, useEffect, useState, useRef } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { LuMoveDown, LuMoveUp } from 'react-icons/lu';
import { CiClock2 } from 'react-icons/ci';
import { Order_Status_Color } from '@src/screen/Order_V1/util';

const UnFinishedOrderView = () => {
    const parent_element = useRef<HTMLDivElement>(null);

    const [is_order_negative, set__is_order_negative] = useState<boolean>(true);

    useEffect(() => {
        parent_element.current?.style.setProperty('--icon-background-color', Order_Status_Color.Un_Finished_Order);
    }, []);

    const handle_Class_Name_Order_Negative = () => {
        if (is_order_negative) {
            return style.negative;
        }
        return style.positive;
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.icon_column}>
                <div className={style.icon_box}>
                    <CiClock2 size={25} color="white" />
                </div>
            </div>
            <div className={style.txt_column}>
                <div>Đang xử lý</div>
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
                    <div className={`${handle_Class_Name_Order_Negative()}`}>
                        {!is_order_negative && <LuMoveUp />}
                        {is_order_negative && <LuMoveDown />}
                        <div>12%</div>
                    </div>
                    <div>So với tháng trước</div>
                </div>
            </div>
        </div>
    );
};

export default memo(UnFinishedOrderView);
