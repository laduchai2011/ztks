import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Check_Consent_Field, Request_Consent_Field } from '@src/data_struct/call';
import {
    Check_Consent_Body_Field,
    Request_Consent_Body_Field,
    Outbound_Body_Field,
    Get_Mcc_Info_Body_Field,
} from '@src/data_struct/call/body';
import { CALL_API } from '@src/const/api/call';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const call_RTK = createApi({
    reducerPath: 'call_RTK',
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
        _check_Consent_: builder.query<My_Response_Field<Check_Consent_Field>, Check_Consent_Body_Field>({
            query: (body) => ({
                url: CALL_API.CHECK_CONSENT,
                method: 'POST',
                body,
            }),
        }),
        _get_Mcc_Info_: builder.query<My_Response_Field<any>, Get_Mcc_Info_Body_Field>({
            query: (body) => ({
                url: CALL_API.GET_MCC_INFOR,
                method: 'POST',
                body,
            }),
        }),
        _request_Consent_: builder.mutation<My_Response_Field<Request_Consent_Field>, Request_Consent_Body_Field>({
            query: (body) => ({
                url: CALL_API.REQUEST_CONSENT,
                method: 'POST',
                body,
            }),
        }),
        _outbound_: builder.mutation<My_Response_Field<any>, Outbound_Body_Field>({
            query: (body) => ({
                url: CALL_API.OUT_BOUND,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLazy_check_Consent_Query,
    useLazy_get_Mcc_Info_Query,
    use_request_Consent_Mutation,
    use_outbound_Mutation,
} = call_RTK;
