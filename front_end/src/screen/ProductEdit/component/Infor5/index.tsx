import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Product_Field } from '@src/data_struct/product';
import { isPositiveInteger } from '@src/utility/string';
import {
    set__is_amount_infor,
    set__amount_infor,
    set__is_price_infor,
    set__price_infor,
    set__is_lock_infor,
    set__lock_infor,
} from '@src/redux/slice/Product_Edit';

const Infor2 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const product: Product_Field | undefined = useSelector((state: RootState) => state.Product_Edit_Slice.product);
    const create_status: 'begin' | 'end' = useSelector((state: RootState) => state.Product_Edit_Slice.create_status);

    const [amount, set__amount] = useState<number>(0);
    const [price, set__price] = useState<number>(0);
    const [is_compelled_price, set__is_compelled_price] = useState<boolean>(false);
    const [is_lock, set__is_lock] = useState<boolean>(false);

    useEffect(() => {
        if (!product) return;
        set__amount(product.quantity_in - product.quantity_out);
        set__price(product.unit_price);
        set__is_compelled_price(product.is_compelled_price);
        set__is_lock(product.is_lock);
    }, [product]);

    useEffect(() => {
        if (create_status === 'begin') {
            dispatch(set__amount_infor({ amount: amount }));
            dispatch(set__is_amount_infor(true));
            dispatch(set__price_infor({ price: price, is_compelled_price: is_compelled_price }));
            dispatch(set__is_price_infor(true));
            dispatch(set__lock_infor({ is_lock: is_lock }));
            dispatch(set__is_lock_infor(true));
        }
    }, [create_status, dispatch, amount, price, is_compelled_price, is_lock]);

    const handle_Amount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (!isPositiveInteger(value)) {
            dispatch(
                global_set__data__toast_message({
                    type: messageType_enum.WARN,
                    message: 'Số lượng phải là 1 số nguyên dương !',
                })
            );
            return;
        }
        set__amount(Number(value));
    };

    const handle_Price = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (!isPositiveInteger(value)) {
            dispatch(
                global_set__data__toast_message({
                    type: messageType_enum.WARN,
                    message: 'Giá tiền phải là 1 số nguyên dương !',
                })
            );
            return;
        }
        set__price(Number(value));
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
                    <input value={price} onChange={(e) => handle_Price(e)} placeholder="Nhập giá bán ..." />
                    <span>VND</span>
                </div>
                <div>
                    <div>
                        <input
                            checked={is_compelled_price}
                            onChange={() => set__is_compelled_price(true)}
                            type="checkbox"
                        />
                        <span>Giá cố định</span>
                    </div>
                    <div>
                        <input
                            checked={!is_compelled_price}
                            onChange={() => set__is_compelled_price(false)}
                            type="checkbox"
                        />
                        <span>Giá tối thiểu</span>
                    </div>
                </div>
            </div>
            <div className={style.lock}>
                <div>
                    Khóa <span>*</span>
                </div>
                <div>
                    <div>
                        <input checked={is_lock} onChange={() => set__is_lock(!is_lock)} type="checkbox" />
                        {!is_lock && <span>Đang KHÔNG khóa</span>}
                        {is_lock && <span style={{ color: 'red' }}>Đã bị khóa</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor2);
