import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/ManageAgent/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { AgentField } from '@src/dataStruct/agent';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    newAgents: [],
    memberListDialog: {
        isShow: false,
        agent: undefined,
    },
    agentPayDialog: {
        isShow: false,
        agent: undefined,
    },
};

const ManageAgentSlice = createSlice({
    name: 'ManageAgentSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setData_addNewAgent: (state, action: PayloadAction<AgentField>) => {
            state.newAgents = [...state.newAgents, action.payload];
        },
        clear_newAgents: (state) => {
            state.newAgents = [];
        },
        setIsShow_memberListDialog: (state, action: PayloadAction<boolean>) => {
            state.memberListDialog.isShow = action.payload;
        },
        set_agent_memberListDialog: (state, action: PayloadAction<AgentField>) => {
            state.memberListDialog.agent = action.payload;
        },
        setIsShow_agentPayDialog: (state, action: PayloadAction<boolean>) => {
            state.agentPayDialog.isShow = action.payload;
        },
        set_agent_agentPayDialog: (state, action: PayloadAction<AgentField | undefined>) => {
            state.agentPayDialog.agent = action.payload;
        },
        // set_agentPay_agentPayDialog: (state, action: PayloadAction<AgentPayField | undefined>) => {
        //     state.agentPayDialog.agentPay = action.payload;
        // },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    setData_addNewAgent,
    clear_newAgents,
    setIsShow_memberListDialog,
    set_agent_memberListDialog,
    setIsShow_agentPayDialog,
    set_agent_agentPayDialog,
    // set_agentPay_agentPayDialog,
} = ManageAgentSlice.actions;
export default ManageAgentSlice.reducer;
