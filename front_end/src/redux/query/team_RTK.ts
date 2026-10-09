import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Team_Field, Cursor_Team_Field, Team_Member_Field, Cursor_Team_Member_Field } from '@src/data_struct/team';
import {
    Get_Teams_Body_Field,
    Get_Team_Members_Body_Field,
    Get_Team_By_Id_Body_Field,
    Get_Team_Leader_Body_Field,
    Create_Team_Body_Field,
    Add_Team_Member_Body_Field,
    Lock_Team_Body_Field,
    Lock_Team_Member_Body_Field,
    Edit_Team_Body_Field,
    Delete_Team_Body_Field,
    Delete_Team_Member_Body_Field,
} from '@src/data_struct/team/body';
import { TEAM_API } from '@src/const/api/team';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const team_RTK = createApi({
    reducerPath: 'team_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['Team', 'Team_Member'],
    endpoints: (builder) => ({
        _get_Teams_: builder.query<My_Response_Field<Cursor_Team_Field>, Get_Teams_Body_Field>({
            query: (body) => ({
                url: TEAM_API.GET_TEAMS,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Team', id: 'LIST' },

                ...(result?.data?.items ?? []).map((team) => ({
                    type: 'Team' as const,
                    id: team.id,
                })),
            ],
        }),
        _get_Team_Members_: builder.query<My_Response_Field<Cursor_Team_Member_Field>, Get_Team_Members_Body_Field>({
            query: (body) => ({
                url: TEAM_API.GET_TEAM_MEMBERS,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Team_Member', id: 'LIST' },

                ...(result?.data?.items ?? []).map((teamMember) => ({
                    type: 'Team_Member' as const,
                    id: teamMember.id,
                })),
            ],
        }),
        _get_Team_By_Id_: builder.query<My_Response_Field<Team_Field>, Get_Team_By_Id_Body_Field>({
            query: (body) => ({
                url: TEAM_API.GET_TEAM_BY_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Team', id: 'LIST' },
                ...(result?.data ? [{ type: 'Team' as const, id: result.data.id }] : []),
            ],
        }),
        _get_Team_Leader_: builder.query<My_Response_Field<Team_Member_Field>, Get_Team_Leader_Body_Field>({
            query: (body) => ({
                url: TEAM_API.GET_TEAM_LEADER,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Team_Member', id: 'LIST' },
                ...(result?.data ? [{ type: 'Team_Member' as const, id: result.data.id }] : []),
            ],
        }),
        _create_Team_: builder.mutation<My_Response_Field<Team_Field>, Create_Team_Body_Field>({
            query: (body) => ({
                url: TEAM_API.CREATE_TEAM,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Team', id: 'LIST' }],
        }),
        _add_Team_Member_: builder.mutation<My_Response_Field<Team_Member_Field>, Add_Team_Member_Body_Field>({
            query: (body) => ({
                url: TEAM_API.ADD_TEAM_MEMBER,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Team_Member', id: 'LIST' }],
        }),
        _lock_Team_: builder.mutation<My_Response_Field<Team_Field>, Lock_Team_Body_Field>({
            query: (body) => ({
                url: TEAM_API.LOCK_TEAM,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Team', id: 'LIST' }],
        }),
        _lock_Team_Member_: builder.mutation<My_Response_Field<Team_Member_Field>, Lock_Team_Member_Body_Field>({
            query: (body) => ({
                url: TEAM_API.LOCK_TEAM_MEMBER,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: 'Team_Member', id: body.id }],
        }),
        _edit_Team_: builder.mutation<My_Response_Field<Team_Field>, Edit_Team_Body_Field>({
            query: (body) => ({
                url: TEAM_API.EDIT_TEAM,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: 'Team', id: body.id }],
        }),
        _delete_Team_: builder.mutation<My_Response_Field<Team_Field>, Delete_Team_Body_Field>({
            query: (body) => ({
                url: TEAM_API.DELETE_TEAM,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Team', id: 'LIST' }],
        }),
        _delete_Team_Member_: builder.mutation<My_Response_Field<Team_Member_Field>, Delete_Team_Member_Body_Field>({
            query: (body) => ({
                url: TEAM_API.DELETE_TEAM_MEMBER,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Team_Member', id: 'LIST' }],
        }),
    }),
});

export const {
    useLazy_get_Teams_Query,
    useLazy_get_Team_Members_Query,
    useLazy_get_Team_By_Id_Query,
    useLazy_get_Team_Leader_Query,
    use_create_Team_Mutation,
    use_add_Team_Member_Mutation,
    use_lock_Team_Mutation,
    use_lock_Team_Member_Mutation,
    use_edit_Team_Mutation,
    use_delete_Team_Mutation,
    use_delete_Team_Member_Mutation,
} = team_RTK;
