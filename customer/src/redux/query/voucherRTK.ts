import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PagedVoucherField, VoucherField } from '@src/dataStruct/voucher';
import {
    GetVouchersBodyField,
    GetVoucherWithOrderIdBodyField,
    CustomerUseVoucherBodyField,
} from '@src/dataStruct/voucher/body';
import { VOUCHER_API } from '@src/const/api/voucher';
import { MyResponse } from '@src/dataStruct/response';

export const voucherRTK = createApi({
    reducerPath: 'voucherRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['Voucer', 'usedVoucher'],
    endpoints: (builder) => ({
        getVouchers: builder.query<MyResponse<PagedVoucherField>, GetVouchersBodyField>({
            query: (body) => ({
                url: VOUCHER_API.GET_VOUCHERS,
                method: 'POST',
                body,
            }),
        }),
        getVoucherWithOrderId: builder.query<MyResponse<VoucherField>, GetVoucherWithOrderIdBodyField>({
            query: (body) => ({
                url: VOUCHER_API.GET_VOUCHER_WITH_ORDER_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'usedVoucher', id: arg.orderId }],
        }),
        customerUseVoucher: builder.mutation<MyResponse<VoucherField>, CustomerUseVoucherBodyField>({
            query: (body) => ({
                url: VOUCHER_API.CUSTOMER_USE_VOUCHER,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'usedVoucher', id: arg.orderId }],
        }),
    }),
});

export const { useLazyGetVouchersQuery, useLazyGetVoucherWithOrderIdQuery, useCustomerUseVoucherMutation } = voucherRTK;
