import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NoteField, PagedNoteField } from '@src/dataStruct/note';
import {
    GetNotesBodyField,
    CreateNoteBodyField,
    UpdateNoteBodyField,
    DeleteNoteBodyField,
} from '@src/dataStruct/note/body';
import { NOTE_API } from '@src/const/api/note';
import { MyResponse } from '@src/dataStruct/response';

export const noteRTK = createApi({
    reducerPath: 'noteRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['Notes', 'Note'],
    endpoints: (builder) => ({
        getNotes: builder.query<MyResponse<PagedNoteField>, GetNotesBodyField>({
            query: (body) => ({
                url: NOTE_API.GET_NOTES,
                method: 'POST',
                body,
            }),
            providesTags: ['Notes'],
        }),
        createNote: builder.mutation<MyResponse<NoteField>, CreateNoteBodyField>({
            query: (body) => ({
                url: NOTE_API.CREATE_NOTE,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Notes'],
        }),
        updateNote: builder.mutation<MyResponse<NoteField>, UpdateNoteBodyField>({
            query: (body) => ({
                url: NOTE_API.UPDATE_NOTE,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = noteRTK.util.selectInvalidatedBy(state, [{ type: 'Notes' }]);

                for (const query of queries) {
                    if (query.endpointName !== 'getNotes') continue;

                    const patchResult = dispatch(
                        noteRTK.util.updateQueryData('getNotes', query.originalArgs, (draft) => {
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

        deleteNote: builder.mutation<MyResponse<NoteField>, DeleteNoteBodyField>({
            query: (body) => ({
                url: NOTE_API.DELETE_NOTE,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = noteRTK.util.selectInvalidatedBy(state, [{ type: 'Notes' }]);

                for (const query of queries) {
                    if (query.endpointName !== 'getNotes') continue;

                    const patchResult = dispatch(
                        noteRTK.util.updateQueryData('getNotes', query.originalArgs, (draft) => {
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

export const { useLazyGetNotesQuery, useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } = noteRTK;
