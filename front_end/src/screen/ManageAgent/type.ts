import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { AgentField } from '@src/dataStruct/agent';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    newAgents: AgentField[];
    memberListDialog: {
        isShow: boolean;
        agent?: AgentField;
    };
    agentPayDialog: {
        isShow: boolean;
        agent?: AgentField;
        // agentPay?: AgentPayField;
    };
}
