import { memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';
import { SEE_MORE } from '@src/const/text';

const OneMember = () => {
    const orderList_element = useRef<HTMLDivElement | null>(null);
    const [is_show_list, set__is_show_list] = useState<boolean>(false);

    useEffect(() => {
        if (!orderList_element.current) return;
        const orderListElement = orderList_element.current;

        if (is_show_list) {
            orderListElement.classList.add(style.show);
        } else {
            orderListElement.classList.remove(style.show);
        }
    }, [is_show_list]);

    const handle_Show_List = () => {
        set__is_show_list(!is_show_list);
    };

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
                <div className={style.orderListText} onClick={() => handle_Show_List()}>
                    Danh sách đơn
                </div>
            </div>
            <div className={style.orderList} ref={orderList_element}>
                <div className={style.oneOrder}>
                    <div className={style.index}>1</div>
                    <div className={style.header}>header</div>
                    <div className={style.content}>content</div>
                    <div className={style.phone}>phone</div>
                    <div className={style.money}>tien</div>
                    <div className={style.pay}>pay</div>
                </div>
                <div className={style.seeMoreContainer}>
                    <div>{SEE_MORE}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(OneMember);
