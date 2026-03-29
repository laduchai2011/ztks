import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    PagedMyCustomerField,
    MyCustomerBodyField,
    IsNewMessageField,
    IsNewMessageBodyField,
    DelIsNewMessageBodyField,
} from '@src/dataStruct/myCustom';
import { ZaloCustomerField } from '@src/dataStruct/hookData';
import { MYCUSTOMER_API } from '@src/const/api/myCustomer';
import { MyResponse } from '@src/dataStruct/response';

export const myCustomerRTK = createApi({
    reducerPath: 'myCustomerRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['IsNewMessage', 'getMyCustomers'],
    endpoints: (builder) => ({
        getMyCustomers: builder.query<MyResponse<PagedMyCustomerField>, MyCustomerBodyField>({
            query: (body) => ({
                url: MYCUSTOMER_API.GET_MY_CUSTOMERS,
                method: 'POST',
                body,
            }),
            providesTags: ['getMyCustomers'],
        }),
        getInforCustomerOnZalo: builder.query<MyResponse<ZaloCustomerField>, { customerId: string }>({
            query: ({ customerId }) => `${MYCUSTOMER_API.GET_INFOR_CUSTOMER_ON_ZALO}?customerId=${customerId}`,
        }),
        getIsNewMessage: builder.query<MyResponse<IsNewMessageField>, IsNewMessageBodyField>({
            query: (body) => ({
                url: MYCUSTOMER_API.GET_IS_NEW_MESSAGE,
                method: 'POST',
                body,
            }),
            providesTags: ['IsNewMessage'],
        }),
        delIsNewMessage: builder.mutation<MyResponse<any>, DelIsNewMessageBodyField>({
            query: (body) => ({
                url: MYCUSTOMER_API.Del_IS_NEW_MESSAGE,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['IsNewMessage', 'getMyCustomers'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
    }),
});

export const {
    useGetMyCustomersQuery,
    useGetInforCustomerOnZaloQuery,
    useGetIsNewMessageQuery,
    useLazyGetIsNewMessageQuery,
    useDelIsNewMessageMutation,
} = myCustomerRTK;
