import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { OrderField } from '@src/dataStruct/order';
import { GetOrdersWithPhoneBodyField } from '@src/dataStruct/order/body';
import { SEE_MORE } from '@src/const/text';
import { useLazyGetOrdersWithPhoneQuery } from '@src/redux/query/orderRTK';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import OneOrder from './component/OneOrder';

const List = () => {
    const dispatch = useDispatch<AppDispatch>();
    const getOrdersWithPhoneBody: GetOrdersWithPhoneBodyField | undefined = useSelector(
        (state: RootState) => state.OrderSlice.getOrdersWithPhoneBody
    );

    const [body, setBody] = useState<GetOrdersWithPhoneBodyField | undefined>(undefined);
    const [vouchers, setVouchers] = useState<OrderField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [total, setTotal] = useState<number>(0);

    const [getOrdersWithPhone] = useLazyGetOrdersWithPhoneQuery();

    useEffect(() => {
        if (!getOrdersWithPhoneBody) return;
        dispatch(set_isLoading(true));
        getOrdersWithPhone(getOrdersWithPhoneBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setTotal(resData.data.totalCount);
                    setVouchers(resData.data.items);
                    setHasMore(resData.data.items.length === getOrdersWithPhoneBody.size);
                    setBody({ ...getOrdersWithPhoneBody, page: getOrdersWithPhoneBody.page + 1 });
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [dispatch, getOrdersWithPhoneBody, getOrdersWithPhone]);

    const handleSeeMore = () => {
        if (!body) return;
        if (!hasMore) return;
        dispatch(set_isLoading(true));
        getOrdersWithPhone(body)
            .then((res) => {
                const resData = res.data;
                console.log('getOrdersWithPhone', resData);
                if (resData?.isSuccess && resData.data) {
                    setTotal(resData.data.totalCount);
                    setVouchers((prev) => [...prev, ...(resData.data?.items || [])]);
                    setHasMore(resData.data.items.length === body.size);
                    setBody({ ...body, page: body.page + 1 });
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const list = vouchers.map((item, index) => {
        return <OneOrder key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.total}>{`${vouchers.length} / ${total}`}</div>
            <div className={style.list}>{list}</div>
            <div className={style.seeMore}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(List);
