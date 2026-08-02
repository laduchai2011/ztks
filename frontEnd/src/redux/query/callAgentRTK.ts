import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CallAgentField, ZaloTrunkField } from '@src/dataStruct/callAgent';
import { GetCallAgentWithAccountIdBodyField, CreateZaloTrunkBodyField } from '@src/dataStruct/callAgent/body';
import { CALL_AGENT_API } from '@src/const/api/callAgent';
import { MyResponse } from '@src/dataStruct/response';
import { DeviceEnum } from '@src/device/type';

export const callAgentRTK = createApi({
    reducerPath: 'callAgentRTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: [],
    endpoints: (builder) => ({
        getCallAgentWithAccountId: builder.query<MyResponse<CallAgentField>, GetCallAgentWithAccountIdBodyField>({
            query: (body) => ({
                url: CALL_AGENT_API.GET_CALL_AGENT_WITH_ACCOUNT_ID,
                method: 'POST',
                body,
            }),
        }),
        // getMccInfo: builder.query<MyResponse<any>, GetMccInfoBodyField>({
        //     query: (body) => ({
        //         url: CALL_API.GET_MCC_INFOR,
        //         method: 'POST',
        //         body,
        //     }),
        // }),
        createZaloTrunk: builder.mutation<MyResponse<ZaloTrunkField>, CreateZaloTrunkBodyField>({
            query: (body) => ({
                url: CALL_AGENT_API.CREATE_ZALO_TRUNK,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazyGetCallAgentWithAccountIdQuery, useCreateZaloTrunkMutation } = callAgentRTK;
