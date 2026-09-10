import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CheckInOutField, CheckInOutWithDateField } from '@src/dataStruct/checkInOut';
import {
    CreateCheckInOutBodyField,
    GetMyCheckInOutsBodyField,
    GetCheckInOutsWithDateBodyField,
} from '@src/dataStruct/checkInOut/body';
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
        getCheckInOuts: builder.query<MyResponse<CheckInOutWithDateField[]>, GetMyCheckInOutsBodyField>({
            query: (body) => ({
                url: CHECK_IN_OUT_API.GET_MY_CHECK_IN_OUTS,
                method: 'POST',
                body,
            }),
        }),
        getCheckInOutsWithDate: builder.query<MyResponse<CheckInOutField[]>, GetCheckInOutsWithDateBodyField>({
            query: (body) => ({
                url: CHECK_IN_OUT_API.GET_CHECK_IN_OUTS_WITH_DATE,
                method: 'POST',
                body,
            }),
        }),
        createCheckInOut: builder.mutation<MyResponse<CheckInOutField>, CreateCheckInOutBodyField>({
            query: (body) => ({
                url: CHECK_IN_OUT_API.CREATE_CHECK_IN_OUT,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazyGetCheckInOutsQuery, useLazyGetCheckInOutsWithDateQuery, useCreateCheckInOutMutation } =
    checkInOutRTK;
