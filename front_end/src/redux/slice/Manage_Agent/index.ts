import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/ManageAgent/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Agent_Field } from '@src/data_struct/agent';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    new_agents: [],
    member_list_dialog: {
        is_show: false,
        agent: undefined,
    },
    agent_pay_dialog: {
        is_show: false,
        agent: undefined,
    },
};

const Manage_Agent_Slice = createSlice({
    name: 'Manage_Agent_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__data__add_new_agent: (state, action: PayloadAction<Agent_Field>) => {
            state.new_agents = [...state.new_agents, action.payload];
        },
        clear__new_agents: (state) => {
            state.new_agents = [];
        },
        set__is_show__member_list_dialog: (state, action: PayloadAction<boolean>) => {
            state.member_list_dialog.is_show = action.payload;
        },
        set__agent__member_list_dialog: (state, action: PayloadAction<Agent_Field>) => {
            state.member_list_dialog.agent = action.payload;
        },
        set__is_show__agent_pay_dialog: (state, action: PayloadAction<boolean>) => {
            state.agent_pay_dialog.is_show = action.payload;
        },
        set__agent__agent_pay_dialog: (state, action: PayloadAction<Agent_Field | undefined>) => {
            state.agent_pay_dialog.agent = action.payload;
        },
        // set_agentPay_agentPayDialog: (state, action: PayloadAction<AgentPayField | undefined>) => {
        //     state.agentPayDialog.agentPay = action.payload;
        // },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__data__add_new_agent,
    clear__new_agents,
    set__is_show__member_list_dialog,
    set__agent__member_list_dialog,
    set__is_show__agent_pay_dialog,
    set__agent__agent_pay_dialog,
    // set_agentPay_agentPayDialog,
} = Manage_Agent_Slice.actions;
export default Manage_Agent_Slice.reducer;
