import { AccountField, AccountInformationField } from '@src/dataStruct/account';

export interface state_props {
    id_isNewMessage_current: number;
    account?: AccountField;
    accountInformation?: AccountInformationField;
}
