import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Agent_Field } from '@src/data_struct/agent';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    new_agents: Agent_Field[];
    member_list_dialog: {
        is_show: boolean;
        agent?: Agent_Field;
    };
    agent_pay_dialog: {
        is_show: boolean;
        agent?: Agent_Field;
        // agentPay?: AgentPayField;
    };
}
