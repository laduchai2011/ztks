import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Account_Field,
    Account_Information_Field,
    // Add_Member_Body_Field,
    All_Members_Body_Field,
    Paged_Account_Field,
    Account_Receive_Message_Field,
    Recommend_Field,
} from '@src/data_struct/account';
import {
    Get_Reply_Account_Body_Field,
    Get_Not_Reply_Account_Body_Field,
    Create_Reply_Account_Body_Field,
    Get_Account_Receive_Message_Body_Field,
    Create_Account_Receive_Message_Body_Field,
    Update_Account_Receive_Message_Body_Field,
    Get_Members_Body_Field,
    Add_Member_V1_Body_Field,
    Forget_Password_Body_Field,
    Check_Forget_Password_Body_Field,
    Get_My_Recommend_Body_Field,
    Add_Your_Recommend_Body_Field,
    Leave_All_Account_Receive_Message_Body_Field,
    Leave_Admin_Body_Field,
} from '@src/data_struct/account/body';
import { ACCOUNT_API } from '@src/const/api/account';
import { router_res_type } from '@src/interface';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const account_RTK = createApi({
    reducerPath: 'account_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: [
        'Account',
        'Member_V1',
        'Member_List',
        'Member_Receive_Message',
        'Reply_Accounts',
        'Not_Reply_Accounts',
        'Account_Receive_Message',
        'Recommend',
    ],
    endpoints: (builder) => ({
        _get_Account_With_Id_: builder.query<My_Response_Field<Account_Field>, { id: string }>({
            query: ({ id }) => `${ACCOUNT_API.GET_ACCOUNT_WITH_ID}?id=${id}`,
        }),
        _get_All_Members_: builder.query<My_Response_Field<Account_Field[]>, All_Members_Body_Field>({
            query: (body) => ({
                url: ACCOUNT_API.GET_ALL_MEMBERS,
                method: 'POST',
                body,
            }),
            providesTags: ['Member_List'],
        }),
        _get_Reply_Accounts_: builder.query<My_Response_Field<Paged_Account_Field>, Get_Reply_Account_Body_Field>({
            query: (body) => ({
                url: ACCOUNT_API.GET_REPLY_ACCOUNTS,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Reply_Accounts', id: `LIST-${arg.chat_room_id}` }],
        }),
        _get_Not_Reply_Accounts_: builder.query<
            My_Response_Field<Paged_Account_Field>,
            Get_Not_Reply_Account_Body_Field
        >({
            query: (body) => ({
                url: ACCOUNT_API.GET_NOT_REPLY_ACCOUNTS,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Not_Reply_Accounts', id: `LIST-${arg.chat_room_id}` }],
        }),
        _get_Account_Receive_Message_: builder.query<
            My_Response_Field<Account_Receive_Message_Field>,
            Get_Account_Receive_Message_Body_Field
        >({
            query: (body) => ({
                url: ACCOUNT_API.GET_ACCOUNT_RECEIVE_MESSAGE,
                method: 'POST',
                body,
            }),
            providesTags: ['Account_Receive_Message'],
        }),
        _get_Members_: builder.query<My_Response_Field<Paged_Account_Field>, Get_Members_Body_Field>({
            query: (body) => ({
                url: ACCOUNT_API.GET_MEMBERS,
                method: 'POST',
                body,
            }),
            providesTags: ['Member_V1'],
        }),
        _check_Forget_Password_: builder.query<My_Response_Field<Account_Field>, Check_Forget_Password_Body_Field>({
            query: (body) => ({
                url: ACCOUNT_API.CHECK_FORGET_PASSWORD,
                method: 'POST',
                body: body,
            }),
        }),
        _get_My_Recommend_: builder.query<My_Response_Field<Recommend_Field>, Get_My_Recommend_Body_Field>({
            query: (body) => ({
                url: ACCOUNT_API.GET_MY_RECOMMEND,
                method: 'POST',
                body,
            }),
            providesTags: ['Recommend'],
        }),
        // Mutation (POST)
        _signup_: builder.mutation<router_res_type, { body: Account_Field; token: string }>({
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
        _forget_Password_: builder.mutation<
            My_Response_Field<Account_Field>,
            { body: Forget_Password_Body_Field; token: string }
        >({
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
        _signin_: builder.mutation<My_Response_Field<Account_Field>, Account_Field>({
            query: (body) => ({
                url: ACCOUNT_API.SIGNIN,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Account'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        _signout_: builder.mutation<My_Response_Field<unknown>, void>({
            query: () => ({
                url: ACCOUNT_API.SIGNOUT,
                method: 'POST',
            }),
            invalidatesTags: ['Account'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        // _add_member_: builder.mutation<My_Response_Field<Account_Field>, Add_Member_Body_Field>({
        //     query: (body) => ({
        //         url: ACCOUNT_API.ADD_MEMBER,
        //         method: 'POST',
        //         body,
        //     }),
        //     invalidatesTags: ['MemberList'], // dùng nếu muốn refetch danh sách sau khi thêm
        // }),
        _create_Reply_Account_: builder.mutation<My_Response_Field<Account_Field>, Create_Reply_Account_Body_Field>({
            query: (body) => ({
                url: ACCOUNT_API.CREATE_REPLY_ACCOUNT,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Not_Reply_Accounts', id: `LIST-${arg.chat_room_id}` },
                { type: 'Reply_Accounts', id: `LIST-${arg.chat_room_id}` },
            ],
        }),
        _create_Account_Receive_Message_: builder.mutation<
            My_Response_Field<Account_Receive_Message_Field>,
            Create_Account_Receive_Message_Body_Field
        >({
            query: (body) => ({
                url: ACCOUNT_API.CREATE_ACCOUNT_RECEIVE_MESSAGE,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Account_Receive_Message'],
        }),
        _update_Account_Receive_Message_: builder.mutation<
            My_Response_Field<Account_Receive_Message_Field>,
            Update_Account_Receive_Message_Body_Field
        >({
            query: (body) => ({
                url: ACCOUNT_API.UPDATE_ACCOUNT_RECEIVE_MESSAGE,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Account_Receive_Message'],
        }),
        _add_Member_V1_: builder.mutation<My_Response_Field<Account_Information_Field>, Add_Member_V1_Body_Field>({
            query: (body) => ({
                url: ACCOUNT_API.ADD_MEMBERV1,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Member_V1'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        _add_Your_Recommend_: builder.mutation<My_Response_Field<Recommend_Field>, Add_Your_Recommend_Body_Field>({
            query: (body) => ({
                url: ACCOUNT_API.ADD_YOUR_RECOMMEND,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Recommend'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        _leave_All_Account_Receive_Message_: builder.mutation<
            My_Response_Field<boolean>,
            Leave_All_Account_Receive_Message_Body_Field
        >({
            query: (body) => ({
                url: ACCOUNT_API.LEAVE_ALL_ACCOUNT_RECEIVE_MESSAGE,
                method: 'PATCH',
                body,
            }),
        }),
        _leave_Admin_: builder.mutation<My_Response_Field<boolean>, Leave_Admin_Body_Field>({
            query: (body) => ({
                url: ACCOUNT_API.LEAVE_ADMIN,
                method: 'PATCH',
                body,
            }),
        }),
    }),
});

export const {
    use_get_Account_With_Id_Query,
    useLazy_get_Account_With_Id_Query,
    use_get_All_Members_Query,
    use_get_Reply_Accounts_Query,
    use_get_Not_Reply_Accounts_Query,
    useLazy_get_Members_Query,
    useLazy_check_Forget_Password_Query,
    useLazy_get_My_Recommend_Query,
    use_signup_Mutation,
    use_signin_Mutation,
    use_signout_Mutation,
    use_forget_Password_Mutation,
    // useAddMemberMutation,
    use_create_Reply_Account_Mutation,
    use_get_Account_Receive_Message_Query,
    use_create_Account_Receive_Message_Mutation,
    use_update_Account_Receive_Message_Mutation,
    use_add_Member_V1_Mutation,
    use_add_Your_Recommend_Mutation,
    use_leave_All_Account_Receive_Message_Mutation,
    use_leave_Admin_Mutation,
} = account_RTK;
