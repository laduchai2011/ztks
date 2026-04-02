import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MyResponse } from '@src/dataStruct/response';
import { WalletField, PagedBalanceFluctuationField } from '@src/dataStruct/wallet';
import { GetAllWalletsBodyField, GetbalanceFluctuationsBodyField } from '@src/dataStruct/wallet/body';
import { WALLET_API } from '@src/const/api/wallet';

export const walletRTK = createApi({
    reducerPath: 'walletRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: [],
    endpoints: (builder) => ({
        getAllWallets: builder.query<MyResponse<WalletField[]>, GetAllWalletsBodyField>({
            query: (body) => ({
                url: WALLET_API.GET_ALL_WALLETS,
                method: 'POST',
                body,
            }),
        }),
        getbalanceFluctuations: builder.query<
            MyResponse<PagedBalanceFluctuationField>,
            GetbalanceFluctuationsBodyField
        >({
            query: (body) => ({
                url: WALLET_API.GET_BALANCE_FLUCTUATIONS,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazyGetAllWalletsQuery, useLazyGetbalanceFluctuationsQuery } = walletRTK;
