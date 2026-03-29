import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    PagedMessageField,
    MessageBodyField,
    MessagesHasFilterBodyField,
    MessageField,
    CreateMessageBodyField,
    UpdateMessageStatusBodyField,
} from '@src/dataStruct/message';
import { MESSAGE_API } from '@src/const/api/message';
import { MyResponse } from '@src/dataStruct/response';

export const messageRTK = createApi({
    reducerPath: 'messageRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: [],
    endpoints: (builder) => ({
        getMessages: builder.query<MyResponse<PagedMessageField>, MessageBodyField>({
            query: (body) => ({
                url: MESSAGE_API.GET_MESSAGES,
                method: 'POST',
                body,
            }),
        }),
        getMessagesHasFilter: builder.query<MyResponse<PagedMessageField>, MessagesHasFilterBodyField>({
            query: (body) => ({
                url: MESSAGE_API.GET_MESSAGES_HAS_FILTER,
                method: 'POST',
                body,
            }),
        }),
        createMessage: builder.mutation<MyResponse<MessageField>, CreateMessageBodyField>({
            query: (body) => ({
                url: MESSAGE_API.CREATE_MESSAGE,
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Medication'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
        updateMessageStatus: builder.mutation<MyResponse<MessageField>, UpdateMessageStatusBodyField>({
            query: (body) => ({
                url: MESSAGE_API.UPDATE_MESSAGE_STATUS,
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Medication'], // dùng nếu muốn refetch danh sách sau khi thêm
        }),
    }),
});

export const {
    useGetMessagesQuery,
    // useGetMessagesHasFilterQuery,
    useLazyGetMessagesHasFilterQuery,
    useCreateMessageMutation,
    useUpdateMessageStatusMutation,
} = messageRTK;
