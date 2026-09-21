import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Chat_Session_Field, Paged_Chat_Session_Field } from '@src/data_struct/chat_session';
import {
    Chat_Session_With_Account_Id_Body_Field,
    Chat_Session_Body_Field,
    Update_Selected_Account_Id_Of_Chat_Session_Body_Field,
    Update_Is_Ready_Of_Chat_Session_Body_Field,
    Leave_All_Chat_Session_Body_Field,
} from '@src/data_struct/chat_session/body';
import { CHAT_SESSION_API } from '@src/const/api/chat_session';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const chat_session_RTK = createApi({
    reducerPath: 'chat_session_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['Chat_Session'],
    endpoints: (builder) => ({
        _get_Chat_Sessions_With_Account_Id_: builder.query<
            My_Response_Field<Paged_Chat_Session_Field>,
            Chat_Session_With_Account_Id_Body_Field
        >({
            query: (body) => ({
                url: CHAT_SESSION_API.GET_CHAT_SESSION_WITH_ACCOUNT_ID,
                method: 'POST',
                body,
            }),
            // providesTags: (result) =>
            //     result?.data?.items
            //         ? [
            //               ...result.data.items.map((item) => ({
            //                   type: 'ChatSession' as const,
            //                   id: item.id,
            //               })),
            //               { type: 'ChatSession', id: 'LIST' },
            //           ]
            //         : [{ type: 'ChatSession', id: 'LIST' }],
        }),
        _create_Chat_Session_: builder.mutation<My_Response_Field<Chat_Session_Field>, Chat_Session_Body_Field>({
            query: (body) => ({
                url: CHAT_SESSION_API.CREATE_CHAT_SESSION,
                method: 'POST',
                body,
            }),
            // invalidatesTags: [{ type: 'ChatSessionList', id: 'LIST' }],
            // invalidatesTags: [{ type: 'ChatSession', id: 'LIST' }],
        }),
        _update_Selected_Account_Id_Of_Chat_Session_: builder.mutation<
            My_Response_Field<Chat_Session_Field>,
            Update_Selected_Account_Id_Of_Chat_Session_Body_Field
        >({
            query: (body) => ({
                url: CHAT_SESSION_API.UPDATE_SELECTED_ACCOUNT_ID,
                method: 'PATCH',
                body,
            }),
            // invalidatesTags: (result) => [{ type: 'ChatSession', id: result?.data?.id }],
        }),
        _update_Is_Reay_Of_Chat_Session_: builder.mutation<
            My_Response_Field<Chat_Session_Field>,
            Update_Is_Ready_Of_Chat_Session_Body_Field
        >({
            query: (body) => ({
                url: CHAT_SESSION_API.UPDATE_ISREADY_ID,
                method: 'PATCH',
                body,
            }),
            // invalidatesTags: (result) => [{ type: 'ChatSession', id: result?.data?.id }],
        }),
        _leave_All_Chat_Session_: builder.mutation<My_Response_Field<boolean>, Leave_All_Chat_Session_Body_Field>({
            query: (body) => ({
                url: CHAT_SESSION_API.LEAVE_ALL_CHAT_SESSION,
                method: 'PATCH',
                body,
            }),
        }),
    }),
});

export const {
    use_create_Chat_Session_Mutation,
    useLazy_get_Chat_Sessions_With_Account_Id_Query,
    use_update_Selected_Account_Id_Of_Chat_Session_Mutation,
    use_update_Is_Reay_Of_Chat_Session_Mutation,
    use_leave_All_Chat_Session_Mutation,
} = chat_session_RTK;
