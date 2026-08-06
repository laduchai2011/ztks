import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { CallInStateType, CallOutStateType } from '@src/dataStruct/call';

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
    calling: {
        is: boolean;
        uid?: string;
        chatRoomId?: number;
    };
    call: {
        inState: CallInStateType;
        outState: CallOutStateType;
    };
}
