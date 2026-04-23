import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PagedRequireTakeMoneyField } from '@src/dataStruct/wallet';
import { MemberZtksGetRequiresTakeMoneyBodyField } from '@src/dataStruct/wallet/body';
import { WALLET_API } from '@src/const/api/wallet';
import { MyResponse } from '@src/dataStruct/response';

export const walletRTK = createApi({
    reducerPath: 'walletRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: [],
    endpoints: (builder) => ({
        memberZtksGetRequiresTakeMoney: builder.query<
            MyResponse<PagedRequireTakeMoneyField>,
            MemberZtksGetRequiresTakeMoneyBodyField
        >({
            query: (body) => ({
                url: WALLET_API.MEMBER_ZTKS_GET_REQUIRES_TAKE_MONEY,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazyMemberZtksGetRequiresTakeMoneyQuery } = walletRTK;
