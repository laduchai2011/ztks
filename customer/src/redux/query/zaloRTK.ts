import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { ZaloOaWithIdBodyField } from '@src/dataStruct/zalo/body';

import { ZALO_API } from '@src/const/api/zalo';
import { MyResponse } from '@src/dataStruct/response';

export const zaloRTK = createApi({
    reducerPath: 'zaloRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: [],
    endpoints: (builder) => ({
        getZaloOaWithId: builder.query<MyResponse<ZaloOaField>, ZaloOaWithIdBodyField>({
            query: (body) => ({
                url: ZALO_API.GET_ZALOOA_WITH_ID,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazyGetZaloOaWithIdQuery } = zaloRTK;
