import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BankField } from '@src/dataStruct/bank';
import {
    AddBankBodyField,
    EditBankBodyField,
    GetBankWithIdBodyField,
    GetAllBanksBodyField,
} from '@src/dataStruct/bank/body';
import { BANK_API } from '@src/const/api/bank';
import { MyResponse } from '@src/dataStruct/response';

export const bankRTK = createApi({
    reducerPath: 'bankRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
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
        getAllBanks: builder.query<MyResponse<BankField[]>, GetAllBanksBodyField>({
            query: (body) => ({
                url: BANK_API.GET_ALL_BANKS,
                method: 'POST',
                body,
            }),
            providesTags: [{ type: 'AllBank' }],
        }),
        addBank: builder.mutation<MyResponse<BankField>, AddBankBodyField>({
            query: (body) => ({
                url: BANK_API.ADD_BANK,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'AllBank' }],
        }),
        editBank: builder.mutation<MyResponse<BankField>, EditBankBodyField>({
            query: (body) => ({
                url: BANK_API.EDIT_BANK,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result) => [{ type: 'Bank', id: result?.data?.id }],
        }),
    }),
});

export const { useLazyGetAllBanksQuery, useGetBankWithIdQuery, useAddBankMutation, useEditBankMutation } = bankRTK;
