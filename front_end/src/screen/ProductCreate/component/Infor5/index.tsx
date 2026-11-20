import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import {
    set__is_amount_infor,
    set__amount_infor,
    set__is_price_infor,
    set__price_infor,
} from '@src/redux/slice/Product_Create';
import { isPositiveInteger } from '@src/utility/string';

const Infor2 = () => {
    const dispatch = useDispatch<AppDispatch>();
    const create_status: 'begin' | 'end' = useSelector((state: RootState) => state.Product_Create_Slice.create_status);

    const [amount, set__amount] = useState<string>('');
    const [price, set__price] = useState<{
        price: string;
        is_compelled_price: boolean;
    }>({
        price: '0',
        is_compelled_price: true,
    });

    useEffect(() => {
        if (create_status === 'begin') {
            if (!isPositiveInteger(amount)) {
                dispatch(
                    global_set__data__toast_message({
                        type: messageType_enum.WARN,
                        message: 'Số lượng phải là 1 số nguyên dương !',
                    })
                );
                return;
            }

            dispatch(set__amount_infor({ amount: Number(amount) }));
            dispatch(set__is_amount_infor(true));
        }
    }, [create_status, dispatch, amount]);

    useEffect(() => {
        if (create_status === 'begin') {
            if (!isPositiveInteger(price.price)) {
                dispatch(
                    global_set__data__toast_message({
                        type: messageType_enum.WARN,
                        message: 'Giá tiền phải là 1 số nguyên dương !',
                    })
                );
                return;
            }

            dispatch(set__price_infor({ price: Number(price.price), is_compelled_price: price.is_compelled_price }));
            dispatch(set__is_price_infor(true));
        }
    }, [create_status, dispatch, price]);

    const handle_Amount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isPositiveInteger(value)) {
            dispatch(
                global_set__data__toast_message({
                    type: messageType_enum.WARN,
                    message: 'Số lượng phải là 1 số nguyên dương !',
                })
            );
        }
        set__amount(value);
    };

    const handle_Price_Value = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isPositiveInteger(value)) {
            dispatch(
                global_set__data__toast_message({
                    type: messageType_enum.WARN,
                    message: 'Giá tiền phải là 1 số nguyên dương !',
                })
            );
        }
        set__price((prev) => ({ ...prev, price: value }));
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div />
                <div>Thông tin khác</div>
            </div>
            <div className={style.quantity}>
                <div>
                    Số lượng <span>*</span>
                </div>
                <div>
                    <input value={amount} onChange={(e) => handle_Amount(e)} placeholder="Nhập số lượng ... " />
                </div>
            </div>
            <div className={style.price}>
                <div>
                    Giá bán <span>*</span>
                </div>
                <div>
                    <input value={price.price} onChange={(e) => handle_Price_Value(e)} placeholder="Nhập giá bán ..." />
                    <span>VND</span>
                </div>
                <div>
                    <div>
                        <input checked={price.is_compelled_price} type="checkbox" />
                        <span>Giá cố định</span>
                    </div>
                    <div>
                        <input checked={!price.is_compelled_price} type="checkbox" />
                        <span>Giá tối thiểu</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor2);
