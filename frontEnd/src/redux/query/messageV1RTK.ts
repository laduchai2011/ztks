import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PagedMessageV1Field, MessageV1Field, NewMessageV1Field } from '@src/dataStruct/message_v1';
import { MessageV1BodyField, CreateMessageV1BodyField } from '@src/dataStruct/message_v1/body';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { MESSAGEV1_API } from '@src/const/api/messageV1';
import { MyResponse } from '@src/dataStruct/response';
import { ResultSendToZaloField } from '@src/dataStruct/zalo/hookData';

export const messageV1RTK = createApi({
    reducerPath: 'messageV1RTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['AllNewMessages'],
    endpoints: (builder) => ({
        getMessagesForChatScreen: builder.query<MyResponse<PagedMessageV1Field<ZaloMessageType>>, MessageV1BodyField>({
            query: (body) => ({
                url: MESSAGEV1_API.GET_MESSAGES_FOR_CHAT_SCREEN,
                method: 'POST',
                body,
            }),
        }),
        getLastMessage: builder.query<MyResponse<MessageV1Field<ZaloMessageType>>, { chatRoomId: string }>({
            query: ({ chatRoomId }) => `${MESSAGEV1_API.GET_LAST_MESSAGE}?chatRoomId=${chatRoomId}`,
            keepUnusedDataFor: 0,
        }),
        getMessageWithId: builder.query<MyResponse<MessageV1Field<ZaloMessageType>>, { id: string }>({
            query: ({ id }) => `${MESSAGEV1_API.GET_MESSAGE_WITH_ID}?id=${id}`,
        }),
        getMessageWithMsgId: builder.query<
            MyResponse<MessageV1Field<ZaloMessageType>>,
            { chat_room_id: number; msg_id: string }
        >({
            query: ({ chat_room_id, msg_id }) =>
                `${MESSAGEV1_API.GET_MESSAGE_WITH_MSG_ID}?chat_room_id=${chat_room_id}&msg_id=${msg_id}`,
        }),
        getAllNewMessages: builder.query<MyResponse<NewMessageV1Field<ZaloMessageType>[]>, { chatRoomId: string }>({
            query: ({ chatRoomId }) => `${MESSAGEV1_API.GET_ALL_NEW_MESSAGE}?chatRoomId=${chatRoomId}`,
            keepUnusedDataFor: 0,
        }),
        createMessageV1: builder.mutation<MyResponse<ResultSendToZaloField>, CreateMessageV1BodyField>({
            query: (body) => ({
                url: MESSAGEV1_API.CREATE_MESSAGEV1,
                method: 'POST',
                body,
            }),
        }),
        delAllNewMessages: builder.query<MyResponse<any>, { chatRoomId: string }>({
            query: ({ chatRoomId }) => `${MESSAGEV1_API.DEL_ALL_NEW_MESSAGE}?chatRoomId=${chatRoomId}`,
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useLazyGetMessagesForChatScreenQuery,
    useGetLastMessageQuery,
    useLazyGetLastMessageQuery,
    useLazyGetMessageWithIdQuery,
    useLazyGetMessageWithMsgIdQuery,
    useLazyGetAllNewMessagesQuery,
    useCreateMessageV1Mutation,
    useLazyDelAllNewMessagesQuery,
} = messageV1RTK;
