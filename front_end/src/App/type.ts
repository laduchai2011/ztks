import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { CallInStateType, CallOutStateType, CallInCmdType, CallOutCmdType } from '@src/dataStruct/call';
import { ZaloUserField } from '@src/dataStruct/zalo/user';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    id_isNewMessage_current: number;
    account?: AccountField;
    accountInformation?: AccountInformationField;
    myAdmin?: number;
    zaloApp?: ZaloAppField;
    callDialog: {
        isShow: boolean;
        uid?: string;
        chatRoomId?: number;
        zaloOa?: ZaloOaField;
        zaloUser?: ZaloUserField;
        callInCmdType: CallInCmdType;
        callOutCmdType: CallOutCmdType;
        callInState: CallInStateType;
        callOutState: CallOutStateType;
    };
}
