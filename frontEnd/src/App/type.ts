import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { CallInStateEnum, CallInStateType, CallOutStateEnum, CallOutStateType } from '@src/dataStruct/call';

export interface state_props {
    id_isNewMessage_current: number;
    account?: AccountField;
    accountInformation?: AccountInformationField;
    myAdmin?: number;
    zaloApp?: ZaloAppField;
    calling: {
        is: boolean;
        uid?: string;
    };
    call: {
        inState: CallInStateType;
        outState: CallOutStateType;
    };
}
