import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    searchedAccountId: string;
    newMember?: AccountField;
}
