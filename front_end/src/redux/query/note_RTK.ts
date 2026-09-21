import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Note_Field, Paged_Note_Field } from '@src/data_struct/note';
import {
    Get_Notes_Body_Field,
    Create_Note_Body_Field,
    Update_Note_Body_Field,
    Delete_Note_Body_Field,
} from '@src/data_struct/note/body';
import { NOTE_API } from '@src/const/api/note';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const note_RTK = createApi({
    reducerPath: 'note_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['Notes', 'Note'],
    endpoints: (builder) => ({
        _get_Notes_: builder.query<My_Response_Field<Paged_Note_Field>, Get_Notes_Body_Field>({
            query: (body) => ({
                url: NOTE_API.GET_NOTES,
                method: 'POST',
                body,
            }),
            providesTags: ['Notes'],
        }),
        _create_Note_: builder.mutation<My_Response_Field<Note_Field>, Create_Note_Body_Field>({
            query: (body) => ({
                url: NOTE_API.CREATE_NOTE,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Notes'],
        }),
        _update_Note_: builder.mutation<My_Response_Field<Note_Field>, Update_Note_Body_Field>({
            query: (body) => ({
                url: NOTE_API.UPDATE_NOTE,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = note_RTK.util.selectInvalidatedBy(state, [{ type: 'Notes' }]);

                for (const query of queries) {
                    if (query.endpointName !== '_get_Notes_') continue;

                    const patchResult = dispatch(
                        note_RTK.util.updateQueryData('_get_Notes_', query.originalArgs, (draft) => {
                            if (!draft.data?.items) return;

                            const note = draft.data.items.find((n) => n.id === arg.id);

                            if (note) {
                                Object.assign(note, arg);
                            }
                        })
                    );

                    patchResults.push(patchResult);
                }

                try {
                    await queryFulfilled;
                } catch {
                    patchResults.forEach((p) => p.undo());
                }
            },
        }),
        _delete_Note_: builder.mutation<My_Response_Field<Note_Field>, Delete_Note_Body_Field>({
            query: (body) => ({
                url: NOTE_API.DELETE_NOTE,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = note_RTK.util.selectInvalidatedBy(state, [{ type: 'Notes' }]);

                for (const query of queries) {
                    if (query.endpointName !== '_get_Notes_') continue;

                    const patchResult = dispatch(
                        note_RTK.util.updateQueryData('_get_Notes_', query.originalArgs, (draft) => {
                            if (!draft.data?.items) return;

                            const note = draft.data.items.find((n) => n.id === arg.id);

                            if (note) {
                                Object.assign(note, arg);
                            }
                        })
                    );

                    patchResults.push(patchResult);
                }

                try {
                    await queryFulfilled;
                } catch {
                    patchResults.forEach((p) => p.undo());
                }
            },
        }),
    }),
});

export const { useLazy_get_Notes_Query, use_create_Note_Mutation, use_update_Note_Mutation, use_delete_Note_Mutation } =
    note_RTK;
