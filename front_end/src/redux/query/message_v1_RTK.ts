import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Paged_Message_V1_Field,
    Message_V1_Field,
    New_Message_V1_Field,
    Call_V1_Field,
} from '@src/data_struct/message_v1';
import {
    Message_V1_Body_Field,
    Create_Message_V1_Body_Field,
    Video_Message_Body_Field,
} from '@src/data_struct/message_v1/body';
import { Zalo_Message_Type, Zalo_Call_Type, Result_Send_To_Zalo_Field } from '@src/data_struct/zalo/hook_data';
import { MESSAGE_V1_API } from '@src/const/api/message_v1';
import { My_Response_Field } from '@src/data_struct/response';
// import { ResultSendToZaloField } from '@src/data_struct/zalo/hook_data';
import { DeviceEnum } from '@src/device/type';

export const message_v1_RTK = createApi({
    reducerPath: 'message_v1_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['All_New_Messages'],
    endpoints: (builder) => ({
        _get_Messages_For_Chat_Screen_: builder.query<
            My_Response_Field<Paged_Message_V1_Field<Zalo_Message_Type, Zalo_Call_Type>>,
            Message_V1_Body_Field
        >({
            query: (body) => ({
                url: MESSAGE_V1_API.GET_MESSAGES_FOR_CHAT_SCREEN,
                method: 'POST',
                body,
            }),
        }),
        _get_Last_Message_: builder.query<
            My_Response_Field<Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type>>,
            { chat_room_id: string }
        >({
            query: ({ chat_room_id }) => `${MESSAGE_V1_API.GET_LAST_MESSAGE}?chat_room_id=${chat_room_id}`,
            keepUnusedDataFor: 0,
        }),
        _get_Last_Message_With_Uid_: builder.query<
            My_Response_Field<Message_V1_Field<Zalo_Message_Type>>,
            { uid: string }
        >({
            query: ({ uid }) => `${MESSAGE_V1_API.GET_LAST_MESSAGE_WITH_UID}?uid=${uid}`,
            keepUnusedDataFor: 0,
        }),
        _get_Message_With_Id_: builder.query<My_Response_Field<Message_V1_Field<Zalo_Message_Type>>, { id: string }>({
            query: ({ id }) => `${MESSAGE_V1_API.GET_MESSAGE_WITH_ID}?id=${id}`,
        }),
        _get_Message_With_Msg_Id_: builder.query<
            My_Response_Field<Message_V1_Field<Zalo_Message_Type>>,
            { chat_room_id: string; msg_id: string }
        >({
            query: ({ chat_room_id, msg_id }) =>
                `${MESSAGE_V1_API.GET_MESSAGE_WITH_MSG_ID}?chat_room_id=${chat_room_id}&msg_id=${msg_id}`,
        }),
        _get_All_New_Messages_: builder.query<
            My_Response_Field<New_Message_V1_Field<Zalo_Message_Type>[]>,
            { chat_room_id: string }
        >({
            query: ({ chat_room_id }) => `${MESSAGE_V1_API.GET_ALL_NEW_MESSAGE}?chat_room_id=${chat_room_id}`,
            keepUnusedDataFor: 0,
        }),
        _create_Message_V1_: builder.mutation<
            My_Response_Field<Result_Send_To_Zalo_Field>,
            Create_Message_V1_Body_Field
        >({
            query: (body) => ({
                url: MESSAGE_V1_API.CREATE_MESSAGE_V1,
                method: 'POST',
                body,
            }),
        }),
        _del_All_New_Messages_: builder.query<My_Response_Field<any>, { chat_room_id: string }>({
            query: ({ chat_room_id }) => `${MESSAGE_V1_API.DEL_ALL_NEW_MESSAGE}?chat_room_id=${chat_room_id}`,
            keepUnusedDataFor: 0,
        }),
        _video_Message_: builder.mutation<My_Response_Field<any>, Video_Message_Body_Field>({
            query: (body) => ({
                url: MESSAGE_V1_API.VIDEO_MESSAGE,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLazy_get_Messages_For_Chat_Screen_Query,
    use_get_Last_Message_Query,
    useLazy_get_Last_Message_Query,
    useLazy_get_Last_Message_With_Uid_Query,
    useLazy_get_Message_With_Id_Query,
    useLazy_get_Message_With_Msg_Id_Query,
    useLazy_get_All_New_Messages_Query,
    use_create_Message_V1_Mutation,
    useLazy_del_All_New_Messages_Query,
    use_video_Message_Mutation,
} = message_v1_RTK;
