import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RequestConsentBodyField, OutboundBodyField, GetMccInfoBodyField } from '@src/dataStruct/call/body';
import { CALL_API } from '@src/const/api/call';
import { MyResponse } from '@src/dataStruct/response';
import { DeviceEnum } from '@src/device/type';

export const callRTK = createApi({
    reducerPath: 'callRTK',
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
        getMccInfo: builder.query<MyResponse<any>, GetMccInfoBodyField>({
            query: (body) => ({
                url: CALL_API.GET_MCC_INFOR,
                method: 'POST',
                body,
            }),
        }),
        requestConsent: builder.mutation<MyResponse<any>, RequestConsentBodyField>({
            query: (body) => ({
                url: CALL_API.REQUEST_CONSENT,
                method: 'POST',
                body,
            }),
        }),
        outbound: builder.mutation<MyResponse<any>, OutboundBodyField>({
            query: (body) => ({
                url: CALL_API.OUT_BOUND,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazyGetMccInfoQuery, useRequestConsentMutation, useOutboundMutation } = callRTK;
