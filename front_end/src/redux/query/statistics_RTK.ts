import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Statistics_Oa_Field } from '@src/data_struct/statistics';
import { Get_Statistics_Oa_Body_Field } from '@src/data_struct/statistics/body';
import { STATISTICS_API } from '@src/const/api/statistics';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const statistics_RTK = createApi({
    reducerPath: 'statistics_RTK',
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
        _get_Statistics_Oa_: builder.query<My_Response_Field<Statistics_Oa_Field[]>, Get_Statistics_Oa_Body_Field>({
            query: (body) => ({
                url: STATISTICS_API.GET_STATISTICS_OA,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazy_get_Statistics_Oa_Query } = statistics_RTK;
