import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE } from '@src/const/text';
import { set__is_show_create_order_v1 } from '@src/redux/slice/Order_V1';
import Infor1 from './component/Infor1';
import Infor2 from './component/Infor2';
import Infor3 from './component/Infor3';
import Infor4 from './component/Infor4';

const CreateOrderDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show: boolean = useSelector((state: RootState) => state.Order_V1_Slice.is_show_create_order_v1);

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
        dispatch(set__is_show_create_order_v1(false));
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.infor}>
                    <Infor1 />
                    <Infor2 />
                    <Infor3 />
                    <Infor4 />
                </div>
            </div>
        </div>
    );
};

export default memo(CreateOrderDialog);
