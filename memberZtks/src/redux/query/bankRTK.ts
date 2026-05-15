import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BankField } from '@src/dataStruct/bank';
import { GetBankWithIdBodyField } from '@src/dataStruct/bank/body';
import { BANK_API } from '@src/const/api/bank';
import { MyResponse } from '@src/dataStruct/response';
import { DeviceEnum } from '@src/device/type';

export const bankRTK = createApi({
    reducerPath: 'bankRTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['AllBank', 'Bank'],
    endpoints: (builder) => ({
        getBankWithId: builder.query<MyResponse<BankField>, GetBankWithIdBodyField>({
            query: (body) => ({
                url: BANK_API.GET_BANK_WITH_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Bank', id: arg.id }],
        }),
    }),
});

export const { useLazyGetBankWithIdQuery } = bankRTK;
