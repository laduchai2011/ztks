import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { ChatSessionField } from '@src/dataStruct/chatSession';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    delDialog: {
        isShow: boolean;
    };
    dialogLoading: {
        isShow: boolean;
    };
    zaloOa?: ZaloOaField;
    chatSessions: ChatSessionField[];
}

export enum Crud_Enum {
    CREATE = 'CREATE',
    LOAD_MORE = 'LOAD_MORE',
}

export type Crud_Type = Crud_Enum.CREATE | Crud_Enum.LOAD_MORE;
