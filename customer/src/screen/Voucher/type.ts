import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { GetVouchersBodyField } from '@src/dataStruct/voucher/body';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    getVouchersBody: GetVouchersBodyField | undefined;
}
