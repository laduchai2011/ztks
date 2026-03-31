import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    AccountField,
    AccountInformationField,
    AddMemberBodyField,
    AllMembersBodyField,
    PagedAccountField,
    AccountReceiveMessageField,
} from '@src/dataStruct/account';
import {
    GetReplyAccountBodyField,
    GetNotReplyAccountBodyField,
    CreateReplyAccountBodyField,
    GetAccountReceiveMessageBodyField,
    CreateAccountReceiveMessageBodyField,
    UpdateAccountReceiveMessageBodyField,
    GetMembersBodyField,
    AddMemberV1BodyField,
    ForgetPasswordBodyField,
    CheckForgetPasswordBodyField,
} from '@src/dataStruct/account/body';
import { ACCOUNT_API } from '@src/const/api/account';
import { router_res_type } from '@src/interface';
import { MyResponse } from '@src/dataStruct/response';

export const accountRTK = createApi({
    reducerPath: 'accountRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: [
        'Account',
        'MemberV1',
        'MemberList',
        'MemberReceiveMessage',
        'ReplyAccounts',
        'NotReplyAccounts',
        'AccountReceiveMessage',
    ],
    endpoints: (builder) => ({
        getAccountWithId: builder.query<MyResponse<AccountField>, { id: number }>({
            query: ({ id }) => `${ACCOUNT_API.GET_ACCOUNT_WITH_ID}?id=${id}`,
        }),
        getMemberReceiveMessage: builder.query<MyResponse<AccountField>, void>({
            query: () => ACCOUNT_API.GET_MEMBER_RECEIVE_MESSAGE,
            providesTags: ['MemberReceiveMessage'],
        }),
        getAllMembers: builder.query<MyResponse<AccountField[]>, AllMembersBodyField>({
            query: (body) => ({
                url: ACCOUNT_API.GET_ALL_MEMBERS,
                method: 'POST',
                body,
            }),
            providesTags: ['MemberList'],
        }),
        getReplyAccounts: builder.query<MyResponse<PagedAccountField>, GetReplyAccountBodyField>({
            query: (body) => ({
                url: ACCOUNT_API.GET_REPLY_ACCOUNt,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'ReplyAccounts', id: `LIST-${arg.chatRoomId}` }],
        }),
        getNotReplyAccounts: builder.query<MyResponse<PagedAccountField>, GetNotReplyAccountBodyField>({
            query: (body) => ({
                url: ACCOUNT_API.GET_NOT_REPLY_ACCOUNT,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'NotReplyAccounts', id: `LIST-${arg.chatRoomId}` }],
        }),
        getAccountReceiveMessage: builder.query<
            MyResponse<AccountReceiveMessageField>,
            GetAccountReceiveMessageBodyField
        >({
            query: (body) => ({
                url: ACCOUNT_API.GET_ACCOUNT_RECEIVE_MESSAGE,
                method: 'POST',
                body,
            }),
            providesTags: ['AccountReceiveMessage'],
        }),
        getMembers: builder.query<MyResponse<PagedAccountField>, GetMembersBodyField>({
            query: (body) => ({
                url: ACCOUNT_API.GET_MEMBERS,
                method: 'POST',
                body,
            }),
            providesTags: ['MemberV1'],
        }),
        checkForgetPassword: builder.query<MyResponse<AccountField>, CheckForgetPasswordBodyField>({
            query: (body) => ({
                url: ACCOUNT_API.CHECK_FORGET_PASSWORD,
                method: 'POST',
                body: body,
            }),
        }),
        // Mutation (POST)
        signup: builder.mutation<router_res_type, { body: AccountField; token: string }>({
            query: ({ body, token }) => ({
                url: ACCOUNT_API.SIGNUP,
                method: 'POST',
                body,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Account'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        forgetPassword: builder.mutation<MyResponse<AccountField>, { body: ForgetPasswordBodyField; token: string }>({
            query: ({ body, token }) => ({
                url: ACCOUNT_API.FORGET_PASSWORD,
                method: 'POST',
                body,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Account'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        signin: builder.mutation<MyResponse<AccountField>, AccountField>({
            query: (body) => ({
                url: ACCOUNT_API.SIGNIN,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Account'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        signout: builder.mutation<MyResponse<unknown>, void>({
            query: () => ({
                url: ACCOUNT_API.SIGNOUT,
                method: 'POST',
            }),
            invalidatesTags: ['Account'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        addMember: builder.mutation<MyResponse<AccountField>, AddMemberBodyField>({
            query: (body) => ({
                url: ACCOUNT_API.ADD_MEMBER,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MemberList'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        setMemberReceiveMessage: builder.mutation<MyResponse<AccountField>, AccountField>({
            query: (body) => ({
                url: ACCOUNT_API.SET_MEMBER_RECEIVE_MESSAGE,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MemberReceiveMessage'],
        }),
        createReplyAccount: builder.mutation<MyResponse<AccountField>, CreateReplyAccountBodyField>({
            query: (body) => ({
                url: ACCOUNT_API.CREATE_REPLY_ACCOUNT,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'NotReplyAccounts', id: `LIST-${arg.chatRoomId}` },
                { type: 'ReplyAccounts', id: `LIST-${arg.chatRoomId}` },
            ],
        }),
        createAccountReceiveMessage: builder.mutation<
            MyResponse<AccountReceiveMessageField>,
            CreateAccountReceiveMessageBodyField
        >({
            query: (body) => ({
                url: ACCOUNT_API.CREATE_ACCOUNT_RECEIVE_MESSAGE,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AccountReceiveMessage'],
        }),
        updateAccountReceiveMessage: builder.mutation<
            MyResponse<AccountReceiveMessageField>,
            UpdateAccountReceiveMessageBodyField
        >({
            query: (body) => ({
                url: ACCOUNT_API.UPDATE_ACCOUNT_RECEIVE_MESSAGE,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AccountReceiveMessage'],
        }),
        addMemberV1: builder.mutation<MyResponse<AccountInformationField>, AddMemberV1BodyField>({
            query: (body) => ({
                url: ACCOUNT_API.ADD_MEMBERV1,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MemberV1'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
    }),
});

export const {
    useGetAccountWithIdQuery,
    useLazyGetAccountWithIdQuery,
    useGetMemberReceiveMessageQuery,
    useGetAllMembersQuery,
    useGetReplyAccountsQuery,
    useGetNotReplyAccountsQuery,
    useLazyGetMembersQuery,
    useLazyCheckForgetPasswordQuery,
    useSignupMutation,
    useSigninMutation,
    useSignoutMutation,
    useForgetPasswordMutation,
    useAddMemberMutation,
    useSetMemberReceiveMessageMutation,
    useCreateReplyAccountMutation,
    useGetAccountReceiveMessageQuery,
    useCreateAccountReceiveMessageMutation,
    useUpdateAccountReceiveMessageMutation,
    useAddMemberV1Mutation,
} = accountRTK;
