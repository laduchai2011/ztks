import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChatSessionField, PagedChatSessionField } from '@src/dataStruct/chatSession';
import {
    ChatSessionWithAccountIdBodyField,
    ChatSessionBodyField,
    UpdateSelectedAccountIdOfChatSessionBodyField,
    UpdateIsReadyOfChatSessionBodyField,
} from '@src/dataStruct/chatSession/body';
import { CHAT_SESSION_API } from '@src/const/api/chatSession';
import { MyResponse } from '@src/dataStruct/response';

export const chatSessionRTK = createApi({
    reducerPath: 'chatSessionRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['ChatSession'],
    endpoints: (builder) => ({
        getChatSessionsWithAccountId: builder.query<
            MyResponse<PagedChatSessionField>,
            ChatSessionWithAccountIdBodyField
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
        createChatSession: builder.mutation<MyResponse<ChatSessionField>, ChatSessionBodyField>({
            query: (body) => ({
                url: CHAT_SESSION_API.CREATE_CHAT_SESSION,
                method: 'POST',
                body,
            }),
            // invalidatesTags: [{ type: 'ChatSessionList', id: 'LIST' }],
            // invalidatesTags: [{ type: 'ChatSession', id: 'LIST' }],
        }),
        updateSelectedAccountIdOfChatSession: builder.mutation<
            MyResponse<ChatSessionField>,
            UpdateSelectedAccountIdOfChatSessionBodyField
        >({
            query: (body) => ({
                url: CHAT_SESSION_API.UPDATE_SELECTED_ACCOUNT_ID,
                method: 'PATCH',
                body,
            }),
            // invalidatesTags: (result) => [{ type: 'ChatSession', id: result?.data?.id }],
        }),
        updateIsReayOfChatSession: builder.mutation<MyResponse<ChatSessionField>, UpdateIsReadyOfChatSessionBodyField>({
            query: (body) => ({
                url: CHAT_SESSION_API.UPDATE_ISREADY_ID,
                method: 'PATCH',
                body,
            }),
            // invalidatesTags: (result) => [{ type: 'ChatSession', id: result?.data?.id }],
        }),
    }),
});

export const {
    useCreateChatSessionMutation,
    useGetChatSessionsWithAccountIdQuery,
    useUpdateSelectedAccountIdOfChatSessionMutation,
    useUpdateIsReayOfChatSessionMutation,
} = chatSessionRTK;
