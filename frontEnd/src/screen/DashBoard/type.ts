import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { StatisticsField, StatisticsTotalField } from '@src/dataStruct/statistics';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    selectedOa?: ZaloOaField;
    statisticsTotal: StatisticsTotalField;
    statistics: StatisticsField[];
}
