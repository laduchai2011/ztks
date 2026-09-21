import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Zalo_App_Field,
    Paged_Zalo_Oa_Field,
    Zalo_Oa_Field,
    Zalo_Oa_Token_Field,
    Gen_Zalo_Oa_Token_Result_Field,
    Zns_Template_Field,
    Paged_Zns_Template_Field,
    Zns_Message_Field,
} from '@src/data_struct/zalo';
import {
    Get_Zalo_App_With_Account_Id_Body_Field,
    Get_Zalo_Oa_List_With_2_Fk_Body_Field,
    Get_Zalo_Oa_With_Id_Body_Field,
    Get_Zalo_Oa_With_Oa_Id_Body_Field,
    Gen_Zalo_Oa_Token_Body_Field,
    Get_Zalo_Oa_Token_With_Fk_Body_Field,
    Create_Zalo_Oa_Token_Body_Field,
    Update_Refresh_Token_Of_Zalo_Oa_Body_Field,
    Create_Zalo_Oa_Body_Field,
    Edit_Zalo_Oa_Body_Field,
    Create_Zns_Template_Body_Field,
    Edit_Zns_Template_Body_Field,
    Get_Zns_Templates_Body_Field,
    Create_Zns_Message_Body_Field,
    Get_Zns_Messages_Body_Field,
    Get_Zns_Template_With_Id_Body_Field,
} from '@src/data_struct/zalo/body';
import { Zalo_User_Field } from '@src/data_struct/zalo/user';
import { Get_Zalo_User_Body_Field } from '@src/data_struct/zalo/user/body';
import { ZALO_API } from '@src/const/api/zalo';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const zalo_RTK = createApi({
    reducerPath: 'zalo_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['Zalo_Oa_List', 'Zalo_Oa', 'Zalo_Oa_Token', 'Zns_Templates', 'Zns_Messages'],
    endpoints: (builder) => ({
        _get_Zalo_App_With_Account_Id_: builder.query<
            My_Response_Field<Zalo_App_Field>,
            Get_Zalo_App_With_Account_Id_Body_Field
        >({
            query: (body) => ({
                url: ZALO_API.GET_ZALO_APP_WITH_ACCOUNT_ID,
                method: 'POST',
                body,
            }),
        }),
        _get_Zalo_Oa_List_With_2_Fk_: builder.query<
            My_Response_Field<Paged_Zalo_Oa_Field>,
            Get_Zalo_Oa_List_With_2_Fk_Body_Field
        >({
            query: (body) => ({
                url: ZALO_API.GET_ZALO_OA_LIST_WITH_2_FK,
                method: 'POST',
                body,
            }),
            providesTags: ['Zalo_Oa_List'],
        }),
        _get_Zalo_Oa_With_Id_: builder.query<My_Response_Field<Zalo_Oa_Field>, Get_Zalo_Oa_With_Id_Body_Field>({
            query: (body) => ({
                url: ZALO_API.GET_ZALO_OA_WITH_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Zalo_Oa', id: arg.id }],
        }),
        _get_Zalo_Oa_With_Oa_Id_: builder.query<My_Response_Field<Zalo_Oa_Field>, Get_Zalo_Oa_With_Oa_Id_Body_Field>({
            query: (body) => ({
                url: ZALO_API.GET_ZALO_OA_WITH_OA_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Zalo_Oa', id: arg.oa_id }],
        }),
        _get_Zalo_User_: builder.query<My_Response_Field<Zalo_User_Field>, Get_Zalo_User_Body_Field>({
            query: (body) => ({
                url: ZALO_API.GET_ZALO_USER,
                method: 'POST',
                body,
            }),
        }),
        _gen_Zalo_Oa_Token_: builder.mutation<
            My_Response_Field<Gen_Zalo_Oa_Token_Result_Field>,
            Gen_Zalo_Oa_Token_Body_Field
        >({
            query: (body) => ({
                url: ZALO_API.GEN_ZALO_OA_TOKEN,
                method: 'POST',
                body,
            }),
        }),
        _get_Zalo_Oa_Token_With_Fk_: builder.query<
            My_Response_Field<Zalo_Oa_Token_Field>,
            Get_Zalo_Oa_Token_With_Fk_Body_Field
        >({
            query: (body) => ({
                url: ZALO_API.GET_ZALO_OA_TOKEN_WITH_FK,
                method: 'POST',
                body,
            }),
            providesTags: ['Zalo_Oa_Token'],
        }),
        _create_Zalo_Oa_: builder.mutation<My_Response_Field<Zalo_Oa_Field>, Create_Zalo_Oa_Body_Field>({
            query: (body) => ({
                url: ZALO_API.CREATE_ZALO_OA,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Zalo_Oa_List'],
        }),
        _edit_Zalo_Oa_: builder.mutation<My_Response_Field<Zalo_Oa_Field>, Edit_Zalo_Oa_Body_Field>({
            query: (body) => ({
                url: ZALO_API.EDIT_ZALO_OA,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Zalo_Oa', id: arg.id }],
        }),
        _create_Zalo_Oa_Token_: builder.mutation<
            My_Response_Field<Zalo_Oa_Token_Field>,
            Create_Zalo_Oa_Token_Body_Field
        >({
            query: (body) => ({
                url: ZALO_API.CREATE_ZALO_OA_TOKEN,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Zalo_Oa_Token'],
        }),
        _update_Refresh_Token_Of_Zalo_Oa_: builder.mutation<
            My_Response_Field<Zalo_Oa_Token_Field>,
            Update_Refresh_Token_Of_Zalo_Oa_Body_Field
        >({
            query: (body) => ({
                url: ZALO_API.UPDATE_REFRESH_TOKEN_OF_ZALO_OA,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Zalo_Oa_Token'],
        }),
        _get_Zns_Templates_: builder.query<My_Response_Field<Paged_Zns_Template_Field>, Get_Zns_Templates_Body_Field>({
            query: (body) => ({
                url: ZALO_API.GET_ZNS_TEMPLATES,
                method: 'POST',
                body,
            }),
            providesTags: (result) => {
                const items = result?.data?.items;

                if (!items) {
                    return [{ type: 'Zns_Templates', id: 'LIST' }];
                }

                return [
                    ...items.map((item) => ({
                        type: 'Zns_Templates' as const,
                        id: item.id,
                    })),
                    { type: 'Zns_Templates', id: 'LIST' },
                ];
            },
        }),
        _get_Zns_Template_With_Id_: builder.query<
            My_Response_Field<Zns_Template_Field>,
            Get_Zns_Template_With_Id_Body_Field
        >({
            query: (body) => ({
                url: ZALO_API.GET_ZNS_TEMPLATE_WITH_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Zns_Templates', id: result?.data?.id }],
        }),
        _create_Zns_Template_: builder.mutation<My_Response_Field<Zns_Template_Field>, Create_Zns_Template_Body_Field>({
            query: (body) => ({
                url: ZALO_API.CREATE_ZNS_TEMPLATE,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Zns_Templates', id: 'LIST' }],
        }),
        _edit_Zns_Template_: builder.mutation<My_Response_Field<Zns_Template_Field>, Edit_Zns_Template_Body_Field>({
            query: (body) => ({
                url: ZALO_API.EDIT_ZNS_TEMPLATE,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Zns_Templates', id }],
        }),
        _get_Zns_Messages_: builder.query<My_Response_Field<Zns_Message_Field[]>, Get_Zns_Messages_Body_Field>({
            query: (body) => ({
                url: ZALO_API.GET_ZNS_MESSAGES,
                method: 'POST',
                body,
            }),
            providesTags: (result) => {
                const items = result?.data;

                if (!items) {
                    return [{ type: 'Zns_Messages', id: 'LIST' }];
                }

                return [
                    ...items.map((item) => ({
                        type: 'Zns_Messages' as const,
                        id: item.id,
                    })),
                    { type: 'Zns_Messages', id: 'LIST' },
                ];
            },
        }),
        _create_Zns_Message_: builder.mutation<My_Response_Field<Zns_Message_Field>, Create_Zns_Message_Body_Field>({
            query: (body) => ({
                url: ZALO_API.CREATE_ZNS_MESSAGE,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Zns_Messages', id: 'LIST' }],
        }),
    }),
});

export const {
    use_get_Zalo_App_With_Account_Id_Query,
    useLazy_get_Zalo_Oa_List_With_2_Fk_Query,
    use_get_Zalo_Oa_With_Id_Query,
    useLazy_get_Zalo_Oa_With_Id_Query,
    useLazy_get_Zalo_Oa_With_Oa_Id_Query,
    use_get_Zalo_User_Query,
    useLazy_get_Zalo_User_Query,
    use_gen_Zalo_Oa_Token_Mutation,
    useLazy_get_Zalo_Oa_Token_With_Fk_Query,
    use_create_Zalo_Oa_Mutation,
    use_edit_Zalo_Oa_Mutation,
    use_create_Zalo_Oa_Token_Mutation,
    use_update_Refresh_Token_Of_Zalo_Oa_Mutation,
    useLazy_get_Zns_Templates_Query,
    useLazy_get_Zns_Template_With_Id_Query,
    use_create_Zns_Template_Mutation,
    use_edit_Zns_Template_Mutation,
    useLazy_get_Zns_Messages_Query,
    use_create_Zns_Message_Mutation,
} = zalo_RTK;
