import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Order_Field, Paged_Order_Field, Order_Status_Field } from '@src/data_struct/order';
import {
    Create_Order_Body_Field,
    Orders_Filter_Body_Field,
    Update_Order_Body_Field,
    Create_Order_Status_Body_Field,
    Get_All_Order_Status_Body_Field,
    // GetOrderWithIdBodyField,
} from '@src/data_struct/order/body';
import { ORDER_API } from '@src/const/api/order';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const order_RTK = createApi({
    reducerPath: 'order_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['Orders', 'Order', 'All_Order_Status'],
    endpoints: (builder) => ({
        _get_Orders_: builder.query<My_Response_Field<Paged_Order_Field>, Orders_Filter_Body_Field>({
            query: (body) => ({
                url: ORDER_API.GET_ORDERS,
                method: 'POST',
                body,
            }),
            keepUnusedDataFor: 15,
            providesTags: ['Orders'], // dùng nếu muốn refetch sau khi xóa/sửa
        }),
        _get_All_Order_Status_: builder.query<My_Response_Field<Order_Status_Field[]>, Get_All_Order_Status_Body_Field>(
            {
                query: (body) => ({
                    url: ORDER_API.GET_ALL_ORDER_STATUS,
                    method: 'POST',
                    body,
                }),
                providesTags: ['Orders'], // dùng nếu muốn refetch sau khi xóa/sửa
            }
        ),
        _get_Order_With_Id_: builder.query<My_Response_Field<Order_Field>, { id: string }>({
            query: ({ id }) => `${ORDER_API.GET_ORDER_WITH_ID}?id=${id}`,
            // keepUnusedDataFor: 15,
        }),
        _create_Order_: builder.mutation<My_Response_Field<Order_Field>, Create_Order_Body_Field>({
            query: (body) => ({
                url: ORDER_API.CREATE_ORDER,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Orders'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        _update_Order_: builder.mutation<My_Response_Field<Order_Field>, Update_Order_Body_Field>({
            query: (body) => ({
                url: ORDER_API.UPDATE_ORDER,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = order_RTK.util.selectInvalidatedBy(state, [{ type: 'Orders' }]);

                for (const query of queries) {
                    if (query.endpointName !== '_get_Orders_') continue;

                    const patchResult = dispatch(
                        order_RTK.util.updateQueryData('_get_Orders_', query.originalArgs, (draft) => {
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
        _create_Order_Status_: builder.mutation<My_Response_Field<Order_Status_Field>, Create_Order_Status_Body_Field>({
            query: (body) => ({
                url: ORDER_API.CREATE_ORDER_STATUS,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['All_Order_Status'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
    }),
});

export const {
    useLazy_get_Orders_Query,
    useLazy_get_All_Order_Status_Query,
    useLazy_get_Order_With_Id_Query,
    use_create_Order_Mutation,
    use_update_Order_Mutation,
    use_create_Order_Status_Mutation,
} = order_RTK;
