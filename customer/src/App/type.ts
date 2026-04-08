import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField } from '@src/dataStruct/zalo';

export interface state_props {
    id_isNewMessage_current: number;
    account?: AccountField;
    accountInformation?: AccountInformationField;
    myAdmin?: number;
    zaloApp?: ZaloAppField;
}
