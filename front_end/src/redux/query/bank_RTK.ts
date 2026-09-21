import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Bank_Field } from '@src/data_struct/bank';
import {
    Add_Bank_Body_Field,
    Edit_Bank_Body_Field,
    Delete_Bank_Body_Field,
    Get_Bank_With_Id_Body_Field,
    Get_All_Banks_Body_Field,
} from '@src/data_struct/bank/body';
import { BANK_API } from '@src/const/api/bank';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const bank_RTK = createApi({
    reducerPath: 'bank_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['All_Bank', 'Bank'],
    endpoints: (builder) => ({
        _get_Bank_With_Id_: builder.query<My_Response_Field<Bank_Field>, Get_Bank_With_Id_Body_Field>({
            query: (body) => ({
                url: BANK_API.GET_BANK_WITH_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Bank', id: arg.id }],
        }),
        _get_All_Banks_: builder.query<My_Response_Field<Bank_Field[]>, Get_All_Banks_Body_Field>({
            query: (body) => ({
                url: BANK_API.GET_ALL_BANKS,
                method: 'POST',
                body,
            }),
            providesTags: [{ type: 'All_Bank' }],
        }),
        _add_Bank_: builder.mutation<My_Response_Field<Bank_Field>, Add_Bank_Body_Field>({
            query: (body) => ({
                url: BANK_API.ADD_BANK,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'All_Bank' }],
        }),
        _edit_Bank_: builder.mutation<My_Response_Field<Bank_Field>, Edit_Bank_Body_Field>({
            query: (body) => ({
                url: BANK_API.EDIT_BANK,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result) => [{ type: 'Bank', id: result?.data?.id }],
        }),
        _delete_Bank_: builder.mutation<My_Response_Field<Bank_Field>, Delete_Bank_Body_Field>({
            query: (body) => ({
                url: BANK_API.DELETE_BANK,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: [{ type: 'All_Bank' }],
        }),
    }),
});

export const {
    useLazy_get_All_Banks_Query,
    useLazy_get_Bank_With_Id_Query,
    use_add_Bank_Mutation,
    use_edit_Bank_Mutation,
    use_delete_Bank_Mutation,
} = bank_RTK;
