import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { CheckInOutField } from '@src/dataStruct/checkInOut';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    checkInOuts: CheckInOutField[];
}
