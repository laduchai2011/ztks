import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PagedRegisterPostField, PagedPostField, PostField, RegisterPostField } from '@src/dataStruct/post';
import {
    GetRegisterPostsBodyField,
    GetPostsBodyField,
    GetPostWithIdBodyField,
    CreateRegisterPostBodyField,
    EditRegisterPostBodyField,
    DeleteRegisterPostBodyField,
    CreatePostBodyField,
    EditPostBodyField,
} from '@src/dataStruct/post/body';
import { POST_API } from '@src/const/api/post';
import { MyResponse } from '@src/dataStruct/response';

export const postRTK = createApi({
    reducerPath: 'postRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: [],
    endpoints: (builder) => ({
        getRegisterPosts: builder.query<MyResponse<PagedRegisterPostField>, GetRegisterPostsBodyField>({
            query: (body) => ({
                url: POST_API.GET_REGISTER_POSTS,
                method: 'POST',
                body,
            }),
        }),
        getPosts: builder.query<MyResponse<PagedPostField>, GetPostsBodyField>({
            query: (body) => ({
                url: POST_API.GET_POSTS,
                method: 'POST',
                body,
            }),
        }),
        getPostWithId: builder.query<MyResponse<PostField>, GetPostWithIdBodyField>({
            query: (body) => ({
                url: POST_API.GET_POST_WITH_ID,
                method: 'POST',
                body,
            }),
        }),
        createRegisterPost: builder.mutation<MyResponse<RegisterPostField>, CreateRegisterPostBodyField>({
            query: (body) => ({
                url: POST_API.CREATE_REGISTER_POST,
                method: 'POST',
                body,
            }),
        }),
        editRegisterPost: builder.mutation<MyResponse<RegisterPostField>, EditRegisterPostBodyField>({
            query: (body) => ({
                url: POST_API.EDIT_REGISTER_POST,
                method: 'POST',
                body,
            }),
        }),
        deleteRegisterPost: builder.mutation<MyResponse<RegisterPostField>, DeleteRegisterPostBodyField>({
            query: (body) => ({
                url: POST_API.DELETE_REGISTER_POST,
                method: 'POST',
                body,
            }),
        }),
        createPost: builder.mutation<MyResponse<PostField>, CreatePostBodyField>({
            query: (body) => ({
                url: POST_API.CREATE_POST,
                method: 'POST',
                body,
            }),
        }),
        editPost: builder.mutation<MyResponse<PostField>, EditPostBodyField>({
            query: (body) => ({
                url: POST_API.EDIT_POST,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLazyGetRegisterPostsQuery,
    useLazyGetPostsQuery,
    useLazyGetPostWithIdQuery,
    useCreateRegisterPostMutation,
    useEditRegisterPostMutation,
    useDeleteRegisterPostMutation,
    useCreatePostMutation,
    useEditPostMutation,
} = postRTK;
