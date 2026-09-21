import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { StatisticsOaField } from '@src/dataStruct/statistics';
import { GetStatisticsOaBodyField } from '@src/dataStruct/statistics/body';
import { STATISTICS_API } from '@src/const/api/statistics';
import { MyResponse } from '@src/dataStruct/response';
import { DeviceEnum } from '@src/device/type';

export const statisticsRTK = createApi({
    reducerPath: 'statisticsRTK',
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
        getStatisticsOa: builder.query<MyResponse<StatisticsOaField[]>, GetStatisticsOaBodyField>({
            query: (body) => ({
                url: STATISTICS_API.GET_STATISTICS_OA,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazyGetStatisticsOaQuery } = statisticsRTK;
