import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { BankField } from '@src/dataStruct/bank';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    addBank: {
        newBank?: BankField;
    };
    editBankDialog: {
        isShow: boolean;
        bank?: BankField;
        newBank?: BankField;
    };
}
