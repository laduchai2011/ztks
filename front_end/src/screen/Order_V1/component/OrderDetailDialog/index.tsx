import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { LiaShoppingBasketSolid } from 'react-icons/lia';
import { CLOSE } from '@src/const/text';
import { Order_V1_Field, Order_V1_Status_Enum } from '@src/data_struct/order_v1';
import { formatMoney, formatDate } from '@src/utility/string';

const OrderDetailDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const [is_show, set__is_show] = useState<boolean>(true);
    const [order, set__order] = useState<Order_V1_Field | undefined>(undefined);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [is_show]);

    const handle_Close = () => {
        set__is_show(false);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.infor1}>
                    <div className={style.infor11}>
                        <div>
                            <div>
                                <div>
                                    <LiaShoppingBasketSolid size={35} color="white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>Mã đơn hàng</div>
                                <div>dsfgdfgdfdf-dfg-dgdfgdfgdfg</div>
                            </div>
                        </div>
                    </div>
                    <div>sdfsdg</div>
                </div>
                <div className={style.infor2}></div>
                <div className={style.infor3}></div>
                <div className={style.infor4}></div>
            </div>
        </div>
    );
};

export default memo(OrderDetailDialog);
