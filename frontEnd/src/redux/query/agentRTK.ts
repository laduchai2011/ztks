import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AgentField, PagedAgentField, AgentPayField } from '@src/dataStruct/agent';
import {
    CreateAgentBodyField,
    AgentAddAccountBodyField,
    AgentDelAccountBodyField,
    GetAgentsBodyField,
    GetLastAgentPayBodyField,
    CreateAgentPayBodyField,
    GetAgentWithAgentAccountIdBodyField,
} from '@src/dataStruct/agent/body';
import { AGENT_API } from '@src/const/api/agent';
import { MyResponse } from '@src/dataStruct/response';

export const agentRTK = createApi({
    reducerPath: 'agentRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: ['Agent', 'Agents', 'AgentPay'],
    endpoints: (builder) => ({
        getAgentWithId: builder.query<MyResponse<AgentField>, { id: number }>({
            query: ({ id }) => `${AGENT_API.GET_AGENT_WITH_ID}?id=${id}`,
            providesTags: (result, error, arg) => [{ type: 'Agent', id: arg.id }],
        }),
        getAgentWithAgentAccountId: builder.query<MyResponse<AgentField>, GetAgentWithAgentAccountIdBodyField>({
            query: (body) => ({
                url: AGENT_API.GET_AGENT_WITH_AGENT_ACCOUNT_ID,
                method: 'POST',
                body,
            }),
        }),
        getAgents: builder.query<MyResponse<PagedAgentField>, GetAgentsBodyField>({
            query: (body) => ({
                url: AGENT_API.GET_AGENTS,
                method: 'POST',
                body,
            }),
            providesTags: ['Agents'],
        }),
        getLastAgentPay: builder.query<MyResponse<AgentPayField>, GetLastAgentPayBodyField>({
            query: (body) => ({
                url: AGENT_API.GET_LAST_AGENT_PAY,
                method: 'POST',
                body,
            }),
            providesTags: (result, error, arg) => [{ type: 'AgentPay', id: arg.agentId }],
        }),
        createAgent: builder.mutation<MyResponse<AgentField>, CreateAgentBodyField>({
            query: (body) => ({
                url: AGENT_API.CREATE_AGENT,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Agents'],
        }),
        agentAddAccount: builder.mutation<MyResponse<AgentField>, AgentAddAccountBodyField>({
            query: (body) => ({
                url: AGENT_API.AGENT_ADD_ACCOUNT,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = agentRTK.util.selectInvalidatedBy(state, [{ type: 'Agents' }]);

                for (const query of queries) {
                    if (query.endpointName !== 'getAgents') continue;

                    const patchResult = dispatch(
                        agentRTK.util.updateQueryData('getAgents', query.originalArgs, (draft) => {
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
        agentDelAccount: builder.mutation<MyResponse<AgentField>, AgentDelAccountBodyField>({
            query: (body) => ({
                url: AGENT_API.AGENT_DEL_ACCOUNT,
                method: 'PATCH',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                // Lấy tất cả query getOrders đang cache
                const patchResults: any[] = [];

                const state = getState() as any;

                const queries = agentRTK.util.selectInvalidatedBy(state, [{ type: 'Agents' }]);

                for (const query of queries) {
                    if (query.endpointName !== 'getAgents') continue;

                    const patchResult = dispatch(
                        agentRTK.util.updateQueryData('getAgents', query.originalArgs, (draft) => {
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
        createAgentPay: builder.mutation<MyResponse<AgentPayField>, CreateAgentPayBodyField>({
            query: (body) => ({
                url: AGENT_API.CREATE_AGENT_PAY,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'AgentPay', id: arg.agentId }],
        }),
    }),
});

export const {
    useLazyGetAgentWithIdQuery,
    useLazyGetAgentWithAgentAccountIdQuery,
    useLazyGetAgentsQuery,
    useLazyGetLastAgentPayQuery,
    useCreateAgentMutation,
    useAgentAddAccountMutation,
    useAgentDelAccountMutation,
    useCreateAgentPayMutation,
} = agentRTK;
