import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PagedOrderField, OrderStatusField } from '@src/dataStruct/order';
import { GetOrdersWithPhoneBodyField, GetAllOrderStatusBodyField } from '@src/dataStruct/order/body';
import { ORDER_API } from '@src/const/api/order';
import { MyResponse } from '@src/dataStruct/response';

export const orderRTK = createApi({
    reducerPath: 'orderRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['Voucer'],
    endpoints: (builder) => ({
        getOrdersWithPhone: builder.query<MyResponse<PagedOrderField>, GetOrdersWithPhoneBodyField>({
            query: (body) => ({
                url: ORDER_API.GET_ORDERS_WITH_PHONE,
                method: 'POST',
                body,
            }),
        }),
        getAllOrderStatus: builder.query<MyResponse<OrderStatusField[]>, GetAllOrderStatusBodyField>({
            query: (body) => ({
                url: ORDER_API.GET_ALL_ORDER_STATUS,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazyGetOrdersWithPhoneQuery, useLazyGetAllOrderStatusQuery } = orderRTK;
