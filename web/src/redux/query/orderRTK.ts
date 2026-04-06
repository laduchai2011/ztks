import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { OrderField, PagedOrderField, OrderStatusField } from '@src/dataStruct/order';
import {
    CreateOrderBodyField,
    OrdersFilterBodyField,
    UpdateOrderBodyField,
    CreateOrderStatusBodyField,
    GetAllOrderStatusBodyField,
    // GetOrderWithIdBodyField,
} from '@src/dataStruct/order/body';
import { ORDER_API } from '@src/const/api/order';
import { MyResponse } from '@src/dataStruct/response';

export const orderRTK = createApi({
    reducerPath: 'orderRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['Orders', 'Order', 'AllOrderStatus'],
    endpoints: (builder) => ({
        getOrders: builder.query<MyResponse<PagedOrderField>, OrdersFilterBodyField>({
            query: (body) => ({
                url: ORDER_API.GET_ORDERS,
                method: 'POST',
                body,
            }),
            keepUnusedDataFor: 15,
            providesTags: ['Orders'], // dùng nếu muốn refetch sau khi xóa/sửa
        }),
        getAllOrderStatus: builder.query<MyResponse<OrderStatusField[]>, GetAllOrderStatusBodyField>({
            query: (body) => ({
                url: ORDER_API.GET_ALL_ORDER_STATUS,
                method: 'POST',
                body,
            }),
            providesTags: ['Orders'], // dùng nếu muốn refetch sau khi xóa/sửa
        }),
        getOrderWithId: builder.query<MyResponse<OrderField>, { id: number }>({
            query: ({ id }) => `${ORDER_API.GET_ORDER_WITH_ID}?id=${id}`,
            // keepUnusedDataFor: 15,
        }),
        createOrder: builder.mutation<MyResponse<OrderField>, CreateOrderBodyField>({
            query: (body) => ({
                url: ORDER_API.CREATE_ORDER,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Orders'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        updateOrder: builder.mutation<MyResponse<OrderField>, UpdateOrderBodyField>({
            query: (body) => ({
                url: ORDER_API.UPDATE_ORDER,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = orderRTK.util.selectInvalidatedBy(state, [{ type: 'Orders' }]);

                for (const query of queries) {
                    if (query.endpointName !== 'getOrders') continue;

                    const patchResult = dispatch(
                        orderRTK.util.updateQueryData('getOrders', query.originalArgs, (draft) => {
                            if (!draft.data?.items) return;

                            const order = draft.data.items.find((o) => o.id === arg.id);

                            if (order) {
                                Object.assign(order, arg);
                            }
                        })
                    );

                    patchResults.push(patchResult);
                }

                try {
                    await queryFulfilled;
                } catch {
                    patchResults.forEach((p) => p.undo());
                }
            },
        }),
        createOrderStatus: builder.mutation<MyResponse<OrderStatusField>, CreateOrderStatusBodyField>({
            query: (body) => ({
                url: ORDER_API.CREATE_ORDER_STATUS,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AllOrderStatus'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
    }),
});

export const {
    useLazyGetOrdersQuery,
    useLazyGetAllOrderStatusQuery,
    useLazyGetOrderWithIdQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useCreateOrderStatusMutation,
} = orderRTK;
