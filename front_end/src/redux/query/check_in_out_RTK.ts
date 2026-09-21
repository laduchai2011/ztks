import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Check_In_Out_Field,
    Check_In_Out_With_Date_Field,
    Check_In_Out_Inspect_Field,
} from '@src/data_struct/check_in_out';
import {
    Create_Check_In_Out_Body_Field,
    Get_My_Check_In_Outs_Body_Field,
    Get_Check_In_Outs_With_Date_Body_Field,
    Get_Check_In_Out_Inspect_With_Fk_Body_Field,
    Create_Check_In_Out_Inspect_Body_Field,
} from '@src/data_struct/check_in_out/body';
import { CHECK_IN_OUT_API } from '@src/const/api/check_in_out';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const check_in_out_RTK = createApi({
    reducerPath: 'check_in_out_RTK',
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
        _get_Check_In_Outs_: builder.query<
            My_Response_Field<Check_In_Out_With_Date_Field[]>,
            Get_My_Check_In_Outs_Body_Field
        >({
            query: (body) => ({
                url: CHECK_IN_OUT_API.GET_MY_CHECK_IN_OUTS,
                method: 'POST',
                body,
            }),
        }),
        _get_Check_In_Outs_With_Date_: builder.query<
            My_Response_Field<Check_In_Out_Field[]>,
            Get_Check_In_Outs_With_Date_Body_Field
        >({
            query: (body) => ({
                url: CHECK_IN_OUT_API.GET_CHECK_IN_OUTS_WITH_DATE,
                method: 'POST',
                body,
            }),
        }),
        _get_Check_In_Out_Inspect_With_Fk_: builder.query<
            My_Response_Field<Check_In_Out_Inspect_Field>,
            Get_Check_In_Out_Inspect_With_Fk_Body_Field
        >({
            query: (body) => ({
                url: CHECK_IN_OUT_API.GET_CHECK_IN_OUT_INSPECT_WITH_FK,
                method: 'POST',
                body,
            }),
        }),
        _create_Check_In_Out_: builder.mutation<My_Response_Field<Check_In_Out_Field>, Create_Check_In_Out_Body_Field>({
            query: (body) => ({
                url: CHECK_IN_OUT_API.CREATE_CHECK_IN_OUT,
                method: 'POST',
                body,
            }),
        }),
        _create_Check_In_Out_Inspect_: builder.mutation<
            My_Response_Field<Check_In_Out_Inspect_Field>,
            Create_Check_In_Out_Inspect_Body_Field
        >({
            query: (body) => ({
                url: CHECK_IN_OUT_API.CREATE_CHECK_IN_OUT_INSPECT,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLazy_get_Check_In_Outs_Query,
    useLazy_get_Check_In_Outs_With_Date_Query,
    useLazy_get_Check_In_Out_Inspect_With_Fk_Query,
    use_create_Check_In_Out_Mutation,
    use_create_Check_In_Out_Inspect_Mutation,
} = check_in_out_RTK;
