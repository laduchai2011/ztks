import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { MemberZtksGetRequiresTakeMoneyBodyField } from '@src/dataStruct/wallet/body';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    filterBody?: MemberZtksGetRequiresTakeMoneyBodyField;
}
