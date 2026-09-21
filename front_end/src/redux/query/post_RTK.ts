import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Paged_Register_Post_Field, Paged_Post_Field, Post_Field, Register_Post_Field } from '@src/data_struct/post';
import {
    Get_Register_Posts_Body_Field,
    Get_Posts_Body_Field,
    // GetPostWithIdBodyField,
    Create_Register_Post_Body_Field,
    Edit_Register_Post_Body_Field,
    Delete_Register_Post_Body_Field,
    Create_Post_Body_Field,
    Edit_Post_Body_Field,
} from '@src/data_struct/post/body';
import { POST_API } from '@src/const/api/post';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const post_RTK = createApi({
    reducerPath: 'post_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: [],
    endpoints: (builder) => ({
        _get_Register_Posts_: builder.query<
            My_Response_Field<Paged_Register_Post_Field>,
            Get_Register_Posts_Body_Field
        >({
            query: (body) => ({
                url: POST_API.GET_REGISTER_POSTS,
                method: 'POST',
                body,
            }),
        }),
        _get_Posts_: builder.query<My_Response_Field<Paged_Post_Field>, Get_Posts_Body_Field>({
            query: (body) => ({
                url: POST_API.GET_POSTS,
                method: 'POST',
                body,
            }),
        }),
        // getPostWithId: builder.query<MyResponse<PostField>, GetPostWithIdBodyField>({
        //     query: (body) => ({
        //         url: POST_API.GET_POST_WITH_ID,
        //         method: 'POST',
        //         body,
        //     }),
        // }),
        _create_Register_Post_: builder.mutation<
            My_Response_Field<Register_Post_Field>,
            Create_Register_Post_Body_Field
        >({
            query: (body) => ({
                url: POST_API.CREATE_REGISTER_POST,
                method: 'POST',
                body,
            }),
        }),
        _edit_Register_Post_: builder.mutation<My_Response_Field<Register_Post_Field>, Edit_Register_Post_Body_Field>({
            query: (body) => ({
                url: POST_API.EDIT_REGISTER_POST,
                method: 'POST',
                body,
            }),
        }),
        _delete_Register_Post_: builder.mutation<
            My_Response_Field<Register_Post_Field>,
            Delete_Register_Post_Body_Field
        >({
            query: (body) => ({
                url: POST_API.DELETE_REGISTER_POST,
                method: 'POST',
                body,
            }),
        }),
        _create_Post_: builder.mutation<My_Response_Field<Post_Field>, Create_Post_Body_Field>({
            query: (body) => ({
                url: POST_API.CREATE_POST,
                method: 'POST',
                body,
            }),
        }),
        _edit_Post_: builder.mutation<My_Response_Field<Post_Field>, Edit_Post_Body_Field>({
            query: (body) => ({
                url: POST_API.EDIT_POST,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLazy_get_Register_Posts_Query,
    useLazy_get_Posts_Query,
    // useLazyGetPostWithIdQuery,
    use_create_Register_Post_Mutation,
    use_edit_Register_Post_Mutation,
    use_delete_Register_Post_Mutation,
    use_create_Post_Mutation,
    use_edit_Post_Mutation,
} = post_RTK;
