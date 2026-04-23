import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PagedRequireTakeMoneyField, RequireTakeMoneyField } from '@src/dataStruct/wallet';
import {
    MemberZtksGetRequiresTakeMoneyBodyField,
    MemberZtksConfirmTakeMoneyBodyField,
} from '@src/dataStruct/wallet/body';
import { WALLET_API } from '@src/const/api/wallet';
import { MyResponse } from '@src/dataStruct/response';

export const walletRTK = createApi({
    reducerPath: 'walletRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['RequiresTakeMoney'],
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
        memberZtksConfirmTakeMoney: builder.mutation<
            MyResponse<RequireTakeMoneyField>,
            MemberZtksConfirmTakeMoneyBodyField
        >({
            query: (body) => ({
                url: WALLET_API.MEMBER_ZTKS_CONFIRM_TAKE_MONEY,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['RequiresTakeMoney'],
        }),
    }),
});

export const { useLazyMemberZtksGetRequiresTakeMoneyQuery, useMemberZtksConfirmTakeMoneyMutation } = walletRTK;
