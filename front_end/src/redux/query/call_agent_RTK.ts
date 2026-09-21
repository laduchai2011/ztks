import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Call_Agent_Field, Zalo_Trunk_Field } from '@src/data_struct/call_agent';
import {
    Get_Call_Agent_With_Account_Id_Body_Field,
    Create_Zalo_Trunk_Body_Field,
} from '@src/data_struct/call_agent/body';
import { CALL_AGENT_API } from '@src/const/api/call_agent';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const call_agent_RTK = createApi({
    reducerPath: 'call_agent_RTK',
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
        _get_Call_Agent_With_Account_Id_: builder.query<
            My_Response_Field<Call_Agent_Field>,
            Get_Call_Agent_With_Account_Id_Body_Field
        >({
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
        _create_Zalo_Trunk_: builder.mutation<My_Response_Field<Zalo_Trunk_Field>, Create_Zalo_Trunk_Body_Field>({
            query: (body) => ({
                url: CALL_AGENT_API.CREATE_ZALO_TRUNK,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLazy_get_Call_Agent_With_Account_Id_Query, use_create_Zalo_Trunk_Mutation } = call_agent_RTK;
