import { memo, useState, useCallback, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import Filter from './component/Filter';
import OneOrder from './component/OneOrder';
import { useLazy_get_Orders_Query } from '@src/redux/query/order_RTK';
import { Order_Field } from '@src/data_struct/order';
import { Orders_Filter_Body_Field } from '@src/data_struct/order/body';
import { set__is_loading, set__new_order__create_order } from '@src/redux/slice/Order';

const OrderList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const new_order_create: Order_Field | undefined = useSelector(
        (state: RootState) => state.Order_Slice.create_order.new_order
    );

    const [filter_body, set__filter_body] = useState<Orders_Filter_Body_Field>({
        page: -1,
        size: 5,
        chat_room_id: '',
        account_id: '',
    });
    const [orders, set__orders] = useState<Order_Field[]>([]);
    const [has_more, set__has_more] = useState<boolean>(false);
    const [get_Orders] = useLazy_get_Orders_Query();

    const handle_Get_Orders = useCallback(
        (orders_filter_body: Orders_Filter_Body_Field) => {
            set__filter_body(orders_filter_body);
            dispatch(set__is_loading(true));
            get_Orders(orders_filter_body)
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data?.data) {
                        set__orders(res_data.data.items);
                        set__has_more(res_data.data.items.length === orders_filter_body.size);
                    }
                })
                .catch((error) => {
                    console.log('OrderList', 'getOrders error: ', error);
                })
                .finally(() => {
                    dispatch(set__is_loading(false));
                });
        },
        [dispatch, get_Orders]
    );

    const handle_See_More = () => {
        if (!has_more || filter_body.page === -1) return;
        const body = { ...filter_body, page: filter_body.page + 1 };
        dispatch(set__is_loading(true));
        get_Orders(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    set__orders((prev) => [...prev, ...(res_data.data?.items || [])]);
                    set__has_more(res_data.data.items.length === body.size);
                }
            })
            .catch((error) => {
                console.log('OrderList', 'get_Orders error: ', error);
            })
            .finally(() => {
                dispatch(set__is_loading(false));
                set__filter_body({ ...filter_body, page: filter_body.page + 1 });
            });
    };

    useEffect(() => {
        if (!new_order_create) return;
        set__orders((prev) => [new_order_create, ...prev]);
        dispatch(set__new_order__create_order(undefined));
    }, [dispatch, new_order_create]);

    const list_order = orders.map((item, index) => {
        return <OneOrder key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <Filter handle_Get_Orders={handle_Get_Orders} />
            {list_order}
            <div className={style.seeMore}>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(OrderList);
