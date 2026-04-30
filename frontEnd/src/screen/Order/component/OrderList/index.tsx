import { memo, useState, useCallback, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import Filter from './component/Filter';
import OneOrder from './component/OneOrder';
import { useLazyGetOrdersQuery } from '@src/redux/query/orderRTK';
import { OrderField } from '@src/dataStruct/order';
import { OrdersFilterBodyField } from '@src/dataStruct/order/body';
import { set_isLoading, setNewOrder_createOrder } from '@src/redux/slice/Order';

const OrderList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const newOrderCreate: OrderField | undefined = useSelector(
        (state: RootState) => state.OrderSlice.createOrder.newOrder
    );
    const [filterBody, setFilterBody] = useState<OrdersFilterBodyField>({
        page: -1,
        size: 5,
        chatRoomId: -1,
        accountId: -1,
    });
    const [orders, setOrders] = useState<OrderField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [getOrders] = useLazyGetOrdersQuery();

    const handleGetOrders = useCallback(
        (ordersFilterBody: OrdersFilterBodyField) => {
            setFilterBody(ordersFilterBody);
            dispatch(set_isLoading(true));
            getOrders(ordersFilterBody)
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData?.data) {
                        setOrders(resData.data.items);
                        setHasMore(resData.data.items.length === ordersFilterBody.size);
                    }
                })
                .catch((error) => {
                    console.log('OrderList', 'getOrders error: ', error);
                })
                .finally(() => {
                    dispatch(set_isLoading(false));
                });
        },
        [dispatch, getOrders]
    );

    const handleSeeMore = () => {
        if (!hasMore || filterBody.page === -1) return;
        const body = { ...filterBody, page: filterBody.page + 1 };
        dispatch(set_isLoading(true));
        getOrders(body)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData?.data) {
                    setOrders((prev) => [...prev, ...(resData.data?.items || [])]);
                    setHasMore(resData.data.items.length === body.size);
                }
            })
            .catch((error) => {
                console.log('OrderList', 'getOrders error: ', error);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
                setFilterBody({ ...filterBody, page: filterBody.page + 1 });
            });
    };

    useEffect(() => {
        if (!newOrderCreate) return;
        setOrders((prev) => [newOrderCreate, ...prev]);
        dispatch(setNewOrder_createOrder(undefined));
    }, [dispatch, newOrderCreate]);

    const list_order = orders.map((item, index) => {
        return <OneOrder key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <Filter handleGetOrders={handleGetOrders} />
            {list_order}
            <div className={style.seeMore}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(OrderList);
