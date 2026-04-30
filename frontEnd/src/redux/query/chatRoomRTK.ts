import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChatRoomField, ChatRoomRoleField, PagedChatRoomMongoField } from '@src/dataStruct/chatRoom';
import {
    GetChatRoomWithIdBodyField,
    ChatRoomRoleWithCridAaidBodyField,
    UpdateSetupChatRoomRoleBodyField,
    ChatRoomsMongoBodyField,
    ChangeChatRoomMasterBodyField,
    GetAllMyChatRoomsBodyField,
} from '@src/dataStruct/chatRoom/body';
import { CHAT_ROOM_API } from '@src/const/api/chatRoom';
import { MyResponse } from '@src/dataStruct/response';

export const chatRoomRTK = createApi({
    reducerPath: 'chatRoomRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['ChatRoomRole', 'ChatRoom'],
    endpoints: (builder) => ({
        getAllMyChatRooms: builder.query<MyResponse<ChatRoomField[]>, GetAllMyChatRoomsBodyField>({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_ALL_MY_CHAT_ROOMS,
                method: 'POST',
                body,
            }),
            keepUnusedDataFor: 0,
        }),
        getChatRoomsWithId: builder.query<MyResponse<ChatRoomField>, GetChatRoomWithIdBodyField>({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_CHAT_ROOM_WITH_ID,
                method: 'POST',
                body,
            }),
        }),
        getChatRoomRoleWithCridAaid: builder.query<MyResponse<ChatRoomRoleField>, ChatRoomRoleWithCridAaidBodyField>({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_CHAT_ROOM_ROLE_WITH_CRID_AAID,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [{ type: 'ChatRoomRole', id: result?.data?.id }],
        }),
        getChatRoomsMongo: builder.query<MyResponse<PagedChatRoomMongoField>, ChatRoomsMongoBodyField>({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_CHAT_ROOMS_MONGO,
                method: 'POST',
                body,
            }),
        }),
        updateSetupChatRoomRole: builder.mutation<MyResponse<ChatRoomRoleField>, UpdateSetupChatRoomRoleBodyField>({
            query: (body) => ({
                url: CHAT_ROOM_API.UPDATE_SETUP_CHAT_ROOM_ROLE,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result) => [{ type: 'ChatRoomRole', id: result?.data?.id }],
        }),
        changeChatRoomMaster: builder.mutation<MyResponse<ChatRoomField>, ChangeChatRoomMasterBodyField>({
            query: (body) => ({
                url: CHAT_ROOM_API.CHANGE_CHAT_ROOM_MASTER,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result) => [{ type: 'ChatRoom', id: result?.data?.id }],
        }),
    }),
});

export const {
    useLazyGetAllMyChatRoomsQuery,
    useLazyGetChatRoomsWithIdQuery,
    useGetChatRoomsWithIdQuery,
    useGetChatRoomRoleWithCridAaidQuery,
    useLazyGetChatRoomsMongoQuery,
    useUpdateSetupChatRoomRoleMutation,
    useChangeChatRoomMasterMutation,
} = chatRoomRTK;
