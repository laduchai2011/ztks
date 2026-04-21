import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { RequireTakeMoneyField, WalletField } from '@src/dataStruct/wallet';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    takeMoneyDialog: {
        isShow: boolean;
        wallet?: WalletField;
        requiredTakeMoney?: RequireTakeMoneyField;
        newRequiredTakeMoney?: RequireTakeMoneyField;
    };
}
