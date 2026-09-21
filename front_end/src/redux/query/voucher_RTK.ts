import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Paged_Voucher_Field, Voucher_Field } from '@src/data_struct/voucher';
import { Get_Vouchers_Body_Field, Get_Voucher_With_Order_Id_Body_Field } from '@src/data_struct/voucher/body';
import { VOUCHER_API } from '@src/const/api/voucher';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const voucher_RTK = createApi({
    reducerPath: 'voucher_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['Voucher'],
    endpoints: (builder) => ({
        _get_Vouchers_: builder.query<My_Response_Field<Paged_Voucher_Field>, Get_Vouchers_Body_Field>({
            query: (body) => ({
                url: VOUCHER_API.GET_VOUCHERS,
                method: 'POST',
                body,
            }),
        }),
        _get_Voucher_With_Order_Id_: builder.query<
            My_Response_Field<Voucher_Field>,
            Get_Voucher_With_Order_Id_Body_Field
        >({
            query: (body) => ({
                url: VOUCHER_API.GET_VOUCHER_WITH_ORDER_ID,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazy_get_Vouchers_Query, useLazy_get_Voucher_With_Order_Id_Query } = voucher_RTK;
