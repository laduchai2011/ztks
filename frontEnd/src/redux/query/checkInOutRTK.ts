import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CheckInOutField } from '@src/dataStruct/checkInOut';
import { CreateCheckInOutBodyField } from '@src/dataStruct/checkInOut/body';
import { CHECK_IN_OUT_API } from '@src/const/api/checkInOut';
import { MyResponse } from '@src/dataStruct/response';
import { DeviceEnum } from '@src/device/type';

export const checkInOutRTK = createApi({
    reducerPath: 'checkInOutRTK',
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
        // getCallAgentWithAccountId: builder.query<MyResponse<CallAgentField>, GetCallAgentWithAccountIdBodyField>({
        //     query: (body) => ({
        //         url: CALL_AGENT_API.GET_CALL_AGENT_WITH_ACCOUNT_ID,
        //         method: 'POST',
        //         body,
        //     }),
        // }),

        createCheckInOut: builder.mutation<MyResponse<CheckInOutField>, CreateCheckInOutBodyField>({
            query: (body) => ({
                url: CHECK_IN_OUT_API.CREATE_CHECK_IN_OUT,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useCreateCheckInOutMutation } = checkInOutRTK;
