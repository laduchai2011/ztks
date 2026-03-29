import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { MessageField } from '@src/dataStruct/message';

export interface state_props {
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    playVideo: {
        isPlay: boolean;
        src: string;
    };
    messages: MessageField[];
}
