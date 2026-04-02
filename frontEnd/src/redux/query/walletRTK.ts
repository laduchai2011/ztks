import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MyResponse } from '@src/dataStruct/response';
import { WalletField, BalanceFluctuationField } from '@src/dataStruct/wallet';
import { GetMyWalletWithTypeBodyField, GetBalanceFluctuationsByDateBodyField } from '@src/dataStruct/wallet/body';
import { WALLET_API } from '@src/const/api/wallet';

export const walletRTK = createApi({
    reducerPath: 'walletRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: [],
    endpoints: (builder) => ({
        getMyWalletWithType: builder.query<MyResponse<WalletField>, GetMyWalletWithTypeBodyField>({
            query: (body) => ({
                url: WALLET_API.GET_MY_WALLET_WITH_TYPE,
                method: 'POST',
                body,
            }),
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
        }),
    }),
});

export const { useLazyGetMyWalletWithTypeQuery, useLazyGetBalanceFluctuationsByDateQuery } = walletRTK;
