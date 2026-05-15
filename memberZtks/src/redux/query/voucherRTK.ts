import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { VoucherField } from '@src/dataStruct/voucher';
import { CreateVoucherBodyField } from '@src/dataStruct/voucher/body';
import { VOUCHER_API } from '@src/const/api/voucher';
import { MyResponse } from '@src/dataStruct/response';
import { DeviceEnum } from '@src/device/type';

export const voucherRTK = createApi({
    reducerPath: 'voucherRTK',
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
        createVoucher: builder.mutation<MyResponse<VoucherField>, CreateVoucherBodyField>({
            query: (body) => ({
                url: VOUCHER_API.CREATE_VOUCHER,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useCreateVoucherMutation } = voucherRTK;
