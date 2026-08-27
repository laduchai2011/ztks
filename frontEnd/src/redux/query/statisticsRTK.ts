import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PagedStatisticsField } from '@src/dataStruct/statistics';
import { GetStatisticsBodyField } from '@src/dataStruct/statistics/body';
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
    tagTypes: ['Voucer'],
    endpoints: (builder) => ({
        getStatistics: builder.query<MyResponse<PagedStatisticsField>, GetStatisticsBodyField>({
            query: (body) => ({
                url: STATISTICS_API.GET_STATISTICS,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazyGetStatisticsQuery } = statisticsRTK;
