import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Agent_Field, Paged_Agent_Field, Agent_Pay_Field } from '@src/data_struct/agent';
import {
    Create_Agent_Body_Field,
    Agent_Add_Account_Body_Field,
    Agent_Del_Account_Body_Field,
    Get_Agents_Body_Field,
    Get_Last_Agent_Pay_Body_Field,
    Create_Agent_Pay_Body_Field,
    Get_Agent_With_Agent_Account_Id_Body_Field,
} from '@src/data_struct/agent/body';
import { AGENT_API } from '@src/const/api/agent';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const agent_RTK = createApi({
    reducerPath: 'agent_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: ['Agent', 'Agents', 'Agent_Pay'],
    endpoints: (builder) => ({
        _get_Agent_With_Id_: builder.query<My_Response_Field<Agent_Field>, { id: string }>({
            query: ({ id }) => `${AGENT_API.GET_AGENT_WITH_ID}?id=${id}`,
            providesTags: (result, error, arg) => [{ type: 'Agent', id: arg.id }],
        }),
        _get_Agent_With_Agent_Account_Id_: builder.query<
            My_Response_Field<Agent_Field>,
            Get_Agent_With_Agent_Account_Id_Body_Field
        >({
            query: (body) => ({
                url: AGENT_API.GET_AGENT_WITH_AGENT_ACCOUNT_ID,
                method: 'POST',
                body,
            }),
        }),
        _get_Agents_: builder.query<My_Response_Field<Paged_Agent_Field>, Get_Agents_Body_Field>({
            query: (body) => ({
                url: AGENT_API.GET_AGENTS,
                method: 'POST',
                body,
            }),
            providesTags: ['Agents'],
        }),
        _get_Last_Agent_Pay_: builder.query<My_Response_Field<Agent_Pay_Field>, Get_Last_Agent_Pay_Body_Field>({
            query: (body) => ({
                url: AGENT_API.GET_LAST_AGENT_PAY,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'Agent_Pay', id: arg.agent_id }],
        }),
        _create_Agent_: builder.mutation<My_Response_Field<Agent_Field>, Create_Agent_Body_Field>({
            query: (body) => ({
                url: AGENT_API.CREATE_AGENT,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Agents'],
        }),
        _agent_Add_Account_: builder.mutation<My_Response_Field<Agent_Field>, Agent_Add_Account_Body_Field>({
            query: (body) => ({
                url: AGENT_API.AGENT_ADD_ACCOUNT,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = agent_RTK.util.selectInvalidatedBy(state, [{ type: 'Agents' }]);

                for (const query of queries) {
                    if (query.endpointName !== '_get_Agents_') continue;

                    const patchResult = dispatch(
                        agent_RTK.util.updateQueryData('_get_Agents_', query.originalArgs, (draft) => {
                            if (!draft.data?.items) return;

                            const agent = draft.data.items.find((a) => a.id === arg.id);

                            if (agent) {
                                Object.assign(agent, arg);
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
        _agent_Del_Account_: builder.mutation<My_Response_Field<Agent_Field>, Agent_Del_Account_Body_Field>({
            query: (body) => ({
                url: AGENT_API.AGENT_DEL_ACCOUNT,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = agent_RTK.util.selectInvalidatedBy(state, [{ type: 'Agents' }]);

                for (const query of queries) {
                    if (query.endpointName !== '_get_Agents_') continue;

                    const patchResult = dispatch(
                        agent_RTK.util.updateQueryData('_get_Agents_', query.originalArgs, (draft) => {
                            if (!draft.data?.items) return;

                            const agent = draft.data.items.find((a) => a.id === arg.id);

                            if (agent) {
                                Object.assign(agent, arg);
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
        _create_Agent_Pay_: builder.mutation<My_Response_Field<Agent_Pay_Field>, Create_Agent_Pay_Body_Field>({
            query: (body) => ({
                url: AGENT_API.CREATE_AGENT_PAY,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Agent_Pay', id: arg.agent_id }],
        }),
    }),
});

export const {
    useLazy_get_Agent_With_Id_Query,
    useLazy_get_Agent_With_Agent_Account_Id_Query,
    useLazy_get_Agents_Query,
    useLazy_get_Last_Agent_Pay_Query,
    use_create_Agent_Mutation,
    use_agent_Add_Account_Mutation,
    use_agent_Del_Account_Mutation,
    use_create_Agent_Pay_Mutation,
} = agent_RTK;
