import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PagedPostField, PostField } from '@src/dataStruct/post';
import { GetPostsBodyField, GetPostWithIdBodyField } from '@src/dataStruct/post/body';
import { POST_API } from '@src/const/api/post';
import { MyResponse } from '@src/dataStruct/response';

export const postRTK = createApi({
    reducerPath: 'postRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: [],
    endpoints: (builder) => ({
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
    }),
});

export const { useLazyGetPostsQuery, useLazyGetPostWithIdQuery } = postRTK;
