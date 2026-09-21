import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Chat_Room_Field,
    Chat_Room_Role_Field,
    Paged_Chat_Room_Mongo_Field,
    Paged_Chat_Room_Field,
    Chat_Room_Phone_Field,
    Paged_Chat_Room_Phone_Field,
} from '@src/data_struct/chat_room';
import {
    Get_Chat_Room_With_Id_Body_Field,
    Get_Chat_Room_Role_With_Crid_Aaid_Body_Field,
    Update_Setup_Chat_Room_Role_Body_Field,
    Chat_Rooms_Mongo_Body_Field,
    Change_Chat_Room_Master_Body_Field,
    Get_My_Chat_Rooms_Body_Field,
    Create_Chat_Room_Phone_Body_Field,
    Get_List_Chat_Room_Phones_Body_Field,
} from '@src/data_struct/chat_room/body';
import { CHAT_ROOM_API } from '@src/const/api/chat_room';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const chat_room_RTK = createApi({
    reducerPath: 'chat_room_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['Chat_Room_Role', 'Chat_Room'],
    endpoints: (builder) => ({
        _get_My_Chat_Rooms_: builder.query<My_Response_Field<Paged_Chat_Room_Field>, Get_My_Chat_Rooms_Body_Field>({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_MY_CHAT_ROOMS,
                method: 'POST',
                body,
            }),
            keepUnusedDataFor: 0,
        }),
        _get_Chat_Rooms_With_Id_: builder.query<My_Response_Field<Chat_Room_Field>, Get_Chat_Room_With_Id_Body_Field>({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_CHAT_ROOM_WITH_ID,
                method: 'POST',
                body,
            }),
        }),
        _get_Chat_Room_Role_With_Crid_Aaid_: builder.query<
            My_Response_Field<Chat_Room_Role_Field>,
            Get_Chat_Room_Role_With_Crid_Aaid_Body_Field
        >({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_CHAT_ROOM_ROLE_WITH_CRID_AAID,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [{ type: 'Chat_Room_Role', id: result?.data?.id }],
        }),
        _get_Chat_Rooms_Mongo_: builder.query<
            My_Response_Field<Paged_Chat_Room_Mongo_Field>,
            Chat_Rooms_Mongo_Body_Field
        >({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_CHAT_ROOMS_MONGO,
                method: 'POST',
                body,
            }),
        }),
        _get_Latest_Chat_Room_Phone_: builder.query<
            My_Response_Field<Chat_Room_Phone_Field>,
            Get_List_Chat_Room_Phones_Body_Field
        >({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_LATEST_CHAT_ROOM_PHONE,
                method: 'POST',
                body,
            }),
        }),
        _get_List_Chat_Room_Phones_: builder.query<
            My_Response_Field<Paged_Chat_Room_Phone_Field>,
            Get_List_Chat_Room_Phones_Body_Field
        >({
            query: (body) => ({
                url: CHAT_ROOM_API.GET_LIST_CHAT_ROOM_PHONES,
                method: 'POST',
                body,
            }),
        }),
        _update_Setup_Chat_Room_Role_: builder.mutation<
            My_Response_Field<Chat_Room_Role_Field>,
            Update_Setup_Chat_Room_Role_Body_Field
        >({
            query: (body) => ({
                url: CHAT_ROOM_API.UPDATE_SETUP_CHAT_ROOM_ROLE,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result) => [{ type: 'Chat_Room_Role', id: result?.data?.id }],
        }),
        _change_Chat_Room_Master_: builder.mutation<
            My_Response_Field<Chat_Room_Field>,
            Change_Chat_Room_Master_Body_Field
        >({
            query: (body) => ({
                url: CHAT_ROOM_API.CHANGE_CHAT_ROOM_MASTER,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result) => [{ type: 'Chat_Room', id: result?.data?.id }],
        }),
        _create_Chat_Room_Phone_: builder.mutation<
            My_Response_Field<Chat_Room_Phone_Field>,
            Create_Chat_Room_Phone_Body_Field
        >({
            query: (body) => ({
                url: CHAT_ROOM_API.CREATE_CHAT_ROOM_PHONE,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result) => [{ type: 'Chat_Room', id: result?.data?.id }],
        }),
    }),
});

export const {
    useLazy_get_My_Chat_Rooms_Query,
    useLazy_get_Chat_Rooms_With_Id_Query,
    use_get_Chat_Rooms_With_Id_Query,
    use_get_Chat_Room_Role_With_Crid_Aaid_Query,
    useLazy_get_Chat_Rooms_Mongo_Query,
    useLazy_get_Latest_Chat_Room_Phone_Query,
    useLazy_get_List_Chat_Room_Phones_Query,
    use_update_Setup_Chat_Room_Role_Mutation,
    use_change_Chat_Room_Master_Mutation,
    use_create_Chat_Room_Phone_Mutation,
} = chat_room_RTK;
