import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField, ZnsTemplateField } from '@src/dataStruct/zalo';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    selectedOa?: ZaloOaField;
    newZnsTemplates: ZnsTemplateField[];
}
