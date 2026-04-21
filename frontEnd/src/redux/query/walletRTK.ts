import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MyResponse } from '@src/dataStruct/response';
import { WalletField, BalanceFluctuationField, RequireTakeMoneyField } from '@src/dataStruct/wallet';
import {
    GetMyWalletWithTypeBodyField,
    GetBalanceFluctuationsByDateBodyField,
    GetBalanceFluctuationLatestDayBodyField,
    PayAgentFromWalletBodyField,
    MemberGetRequireTakeMoneyOfWalletBodyField,
    CreateRequireTakeMoneyBodyField,
    EditRequireTakeMoneyBodyField,
    DeleteRequireTakeMoneyBodyField,
} from '@src/dataStruct/wallet/body';
import { WALLET_API } from '@src/const/api/wallet';

export const walletRTK = createApi({
    reducerPath: 'walletRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['Wallet', 'RequireTakeMoney'],
    endpoints: (builder) => ({
        getMyWalletWithType: builder.query<MyResponse<WalletField>, GetMyWalletWithTypeBodyField>({
            query: (body) => ({
                url: WALLET_API.GET_MY_WALLET_WITH_TYPE,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Wallet', id: result?.data?.id }],
        }),
        getBalanceFluctuationsByDate: builder.query<
            MyResponse<BalanceFluctuationField[]>,
            GetBalanceFluctuationsByDateBodyField
        >({
            query: (body) => ({
                url: WALLET_API.GET_BALANCE_FLUCTUATIONS_BY_DATE,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Wallet', id: arg.walletId }],
        }),
        getBalanceFluctuationLatestDay: builder.query<
            MyResponse<BalanceFluctuationField[]>,
            GetBalanceFluctuationLatestDayBodyField
        >({
            query: (body) => ({
                url: WALLET_API.GET_BALANCE_FLUCTUATION_LATES_DAY,
                method: 'POST',
                body,
            }),
        }),
        payAgentFromWallet: builder.mutation<MyResponse<WalletField>, PayAgentFromWalletBodyField>({
            query: (body) => ({
                url: WALLET_API.PAY_AGENT_FROM_WALLET,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Wallet', id: arg.walletId }],
        }),
        memberGetRequireTakeMoneyOfWallet: builder.query<
            MyResponse<RequireTakeMoneyField>,
            MemberGetRequireTakeMoneyOfWalletBodyField
        >({
            query: (body) => ({
                url: WALLET_API.MEMBER_GET_REQUIRE_TAKE_MONEY_OF_WALLET,
                method: 'POST',
                body,
            }),
            providesTags: [{ type: 'RequireTakeMoney' }],
        }),
        createRequireTakeMoney: builder.mutation<MyResponse<RequireTakeMoneyField>, CreateRequireTakeMoneyBodyField>({
            query: (body) => ({
                url: WALLET_API.CREATE_REQUIRE_TAKE_MONEY,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'RequireTakeMoney' }],
        }),
        editRequireTakeMoney: builder.mutation<MyResponse<RequireTakeMoneyField>, EditRequireTakeMoneyBodyField>({
            query: (body) => ({
                url: WALLET_API.EDIT_REQUIRE_TAKE_MONEY,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'RequireTakeMoney' }],
        }),
        deleteRequireTakeMoney: builder.mutation<MyResponse<RequireTakeMoneyField>, DeleteRequireTakeMoneyBodyField>({
            query: (body) => ({
                url: WALLET_API.DELETE_REQUIRE_TAKE_MONEY,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'RequireTakeMoney' }],
        }),
    }),
});

export const {
    useLazyGetMyWalletWithTypeQuery,
    useLazyGetBalanceFluctuationsByDateQuery,
    useLazyGetBalanceFluctuationLatestDayQuery,
    usePayAgentFromWalletMutation,
    useLazyMemberGetRequireTakeMoneyOfWalletQuery,
    useCreateRequireTakeMoneyMutation,
    useEditRequireTakeMoneyMutation,
    useDeleteRequireTakeMoneyMutation,
} = walletRTK;
