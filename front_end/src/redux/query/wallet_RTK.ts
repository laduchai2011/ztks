import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { My_Response_Field } from '@src/data_struct/response';
import { Wallet_Field, Balance_Fluctuation_Field, Require_Take_Money_Field } from '@src/data_struct/wallet';
import {
    Get_My_Wallet_With_Type_Body_Field,
    Get_Balance_Fluctuations_Body_Field,
    Pay_Agent_From_Wallet_Body_Field,
    Member_Get_Require_Take_Money_Of_Wallet_Body_Field,
    Create_Require_Take_Money_Body_Field,
    Edit_Require_Take_Money_Body_Field,
    Delete_Require_Take_Money_Body_Field,
} from '@src/data_struct/wallet/body';
import { WALLET_API } from '@src/const/api/wallet';
import { DeviceEnum } from '@src/device/type';

export const wallet_RTK = createApi({
    reducerPath: 'wallet_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['Wallet', 'Require_Take_Money'],
    endpoints: (builder) => ({
        _get_My_Wallet_With_Type_: builder.query<My_Response_Field<Wallet_Field>, Get_My_Wallet_With_Type_Body_Field>({
            query: (body) => ({
                url: WALLET_API.GET_MY_WALLET_WITH_TYPE,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Wallet', id: result?.data?.id }],
        }),
        _get_Balance_Fluctuations_: builder.query<
            My_Response_Field<Balance_Fluctuation_Field[]>,
            Get_Balance_Fluctuations_Body_Field
        >({
            query: (body) => ({
                url: WALLET_API.GET_BALANCE_FLUCTUATIONS,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Wallet', id: arg.wallet_id }],
        }),
        _pay_Agent_From_Wallet_: builder.mutation<My_Response_Field<Wallet_Field>, Pay_Agent_From_Wallet_Body_Field>({
            query: (body) => ({
                url: WALLET_API.PAY_AGENT_FROM_WALLET,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Wallet', id: arg.wallet_id }],
        }),
        _member_Get_Require_Take_Money_Of_Wallet_: builder.query<
            My_Response_Field<Require_Take_Money_Field>,
            Member_Get_Require_Take_Money_Of_Wallet_Body_Field
        >({
            query: (body) => ({
                url: WALLET_API.MEMBER_GET_REQUIRE_TAKE_MONEY_OF_WALLET,
                method: 'POST',
                body,
            }),
            providesTags: [{ type: 'Require_Take_Money' }],
        }),
        _create_Require_Take_Money_: builder.mutation<
            My_Response_Field<Require_Take_Money_Field>,
            Create_Require_Take_Money_Body_Field
        >({
            query: (body) => ({
                url: WALLET_API.CREATE_REQUIRE_TAKE_MONEY,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Require_Take_Money' }],
        }),
        _edit_Require_Take_Money_: builder.mutation<
            My_Response_Field<Require_Take_Money_Field>,
            Edit_Require_Take_Money_Body_Field
        >({
            query: (body) => ({
                url: WALLET_API.EDIT_REQUIRE_TAKE_MONEY,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'Require_Take_Money' }],
        }),
        _delete_Require_Take_Money_: builder.mutation<
            My_Response_Field<Require_Take_Money_Field>,
            Delete_Require_Take_Money_Body_Field
        >({
            query: (body) => ({
                url: WALLET_API.DELETE_REQUIRE_TAKE_MONEY,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'Require_Take_Money' }],
        }),
    }),
});

export const {
    useLazy_get_My_Wallet_With_Type_Query,
    useLazy_get_Balance_Fluctuations_Query,
    use_pay_Agent_From_Wallet_Mutation,
    useLazy_member_Get_Require_Take_Money_Of_Wallet_Query,
    use_create_Require_Take_Money_Mutation,
    use_edit_Require_Take_Money_Mutation,
    use_delete_Require_Take_Money_Mutation,
} = wallet_RTK;
