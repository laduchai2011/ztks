import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    ZaloAppField,
    PagedZaloOaField,
    ZaloOaField,
    ZaloOaTokenField,
    GenZaloOaTokenResultField,
    ZnsTemplateField,
    PagedZnsTemplateField,
    ZnsMessageField,
    PagedZnsMessageField,
} from '@src/dataStruct/zalo';
import {
    ZaloAppWithAccountIdBodyField,
    ZaloOaListWith2FkBodyField,
    ZaloOaWithIdBodyField,
    GenZaloOaTokenBodyField,
    GetZaloOaTokenWithFkBodyField,
    CreateZaloOaTokenBodyField,
    UpdateRefreshTokenOfZaloOaBodyField,
    CreateZaloOaBodyField,
    EditZaloOaBodyField,
    CreateZnsTemplateBodyField,
    EditZnsTemplateBodyField,
    GetZnsTemplatesBodyField,
    CreateZnsMessageBodyField,
    GetZnsMessagesBodyField,
} from '@src/dataStruct/zalo/body';
import { ZaloUserField } from '@src/dataStruct/zalo/user';
import { ZaloUserBodyField } from '@src/dataStruct/zalo/user/body';
import { ZALO_API } from '@src/const/api/zalo';
import { MyResponse } from '@src/dataStruct/response';

export const zaloRTK = createApi({
    reducerPath: 'zaloRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['ZaloOa_List', 'ZaloOa', 'ZaloOaToken', 'ZnsTemplates', 'ZnsMessages'],
    endpoints: (builder) => ({
        getZaloAppWithAccountId: builder.query<MyResponse<ZaloAppField>, ZaloAppWithAccountIdBodyField>({
            query: (body) => ({
                url: ZALO_API.GET_ZALOAPP_WITH_ACCOUNT_ID,
                method: 'POST',
                body,
            }),
        }),
        getZaloOaListWith2Fk: builder.query<MyResponse<PagedZaloOaField>, ZaloOaListWith2FkBodyField>({
            query: (body) => ({
                url: ZALO_API.GET_ZALOOA_LIST_WITH_2FK,
                method: 'POST',
                body,
            }),
            providesTags: ['ZaloOa_List'],
        }),
        getZaloOaWithId: builder.query<MyResponse<ZaloOaField>, ZaloOaWithIdBodyField>({
            query: (body) => ({
                url: ZALO_API.GET_ZALOOA_WITH_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'ZaloOa', id: arg.id }],
        }),
        getZaloUser: builder.query<MyResponse<ZaloUserField>, ZaloUserBodyField>({
            query: (body) => ({
                url: ZALO_API.GET_ZALOUSER,
                method: 'POST',
                body,
            }),
        }),
        genZaloOaToken: builder.mutation<MyResponse<GenZaloOaTokenResultField>, GenZaloOaTokenBodyField>({
            query: (body) => ({
                url: ZALO_API.GEN_ZALO_OA_TOKEN,
                method: 'POST',
                body,
            }),
        }),
        getZaloOaTokenWithFk: builder.query<MyResponse<ZaloOaTokenField>, GetZaloOaTokenWithFkBodyField>({
            query: (body) => ({
                url: ZALO_API.GET_ZALO_OA_TOKEN_WITH_FK,
                method: 'POST',
                body,
            }),
            providesTags: ['ZaloOaToken'],
        }),
        createZaloOa: builder.mutation<MyResponse<ZaloOaField>, CreateZaloOaBodyField>({
            query: (body) => ({
                url: ZALO_API.CREATE_ZALO_OA,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ZaloOa_List'],
        }),
        editZaloOa: builder.mutation<MyResponse<ZaloOaField>, EditZaloOaBodyField>({
            query: (body) => ({
                url: ZALO_API.EDIT_ZALO_OA,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'ZaloOa', id: arg.id }],
        }),
        createZaloOaToken: builder.mutation<MyResponse<ZaloOaTokenField>, CreateZaloOaTokenBodyField>({
            query: (body) => ({
                url: ZALO_API.CREATE_ZALO_OA_TOKEN,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ZaloOaToken'],
        }),
        updateRefreshTokenOfZaloOa: builder.mutation<MyResponse<ZaloOaTokenField>, UpdateRefreshTokenOfZaloOaBodyField>(
            {
                query: (body) => ({
                    url: ZALO_API.UPDATE_REFRESH_TOKEN_OF_ZALO_OA,
                    method: 'PATCH',
                    body,
                }),
                invalidatesTags: ['ZaloOaToken'],
            }
        ),
        getZnsTemplates: builder.query<MyResponse<PagedZnsTemplateField>, GetZnsTemplatesBodyField>({
            query: (body) => ({
                url: ZALO_API.GET_ZNS_TEMPLATES,
                method: 'POST',
                body,
            }),
            providesTags: (result) => {
                const items = result?.data?.items;

                if (!items) {
                    return [{ type: 'ZnsTemplates', id: 'LIST' }];
                }

                return [
                    ...items.map((item) => ({
                        type: 'ZnsTemplates' as const,
                        id: item.id,
                    })),
                    { type: 'ZnsTemplates', id: 'LIST' },
                ];
            },
        }),
        createZnsTemplate: builder.mutation<MyResponse<ZnsTemplateField>, CreateZnsTemplateBodyField>({
            query: (body) => ({
                url: ZALO_API.CREATE_ZNS_TEMPLATE,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'ZnsTemplates', id: 'LIST' }],
        }),
        editZnsTemplate: builder.mutation<MyResponse<ZnsTemplateField>, EditZnsTemplateBodyField>({
            query: (body) => ({
                url: ZALO_API.EDIT_ZNS_TEMPLATE,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'ZnsTemplates', id }],
        }),
        getZnsMessages: builder.query<MyResponse<PagedZnsMessageField>, GetZnsMessagesBodyField>({
            query: (body) => ({
                url: ZALO_API.GET_ZNS_MESSAGE,
                method: 'POST',
                body,
            }),
            providesTags: (result) => {
                const items = result?.data?.items;

                if (!items) {
                    return [{ type: 'ZnsMessages', id: 'LIST' }];
                }

                return [
                    ...items.map((item) => ({
                        type: 'ZnsMessages' as const,
                        id: item.id,
                    })),
                    { type: 'ZnsMessages', id: 'LIST' },
                ];
            },
        }),
        createZnsMessage: builder.mutation<MyResponse<ZnsMessageField>, CreateZnsMessageBodyField>({
            query: (body) => ({
                url: ZALO_API.CREATE_ZNS_MESSAGE,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'ZnsMessages', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetZaloAppWithAccountIdQuery,
    useLazyGetZaloOaListWith2FkQuery,
    useGetZaloOaWithIdQuery,
    useLazyGetZaloOaWithIdQuery,
    useGetZaloUserQuery,
    useGenZaloOaTokenMutation,
    useLazyGetZaloOaTokenWithFkQuery,
    useCreateZaloOaMutation,
    useEditZaloOaMutation,
    useCreateZaloOaTokenMutation,
    useUpdateRefreshTokenOfZaloOaMutation,
    useLazyGetZnsTemplatesQuery,
    useCreateZnsTemplateMutation,
    useEditZnsTemplateMutation,
    useLazyGetZnsMessagesQuery,
    useCreateZnsMessageMutation,
} = zaloRTK;
