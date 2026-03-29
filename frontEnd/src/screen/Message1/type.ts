import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    chatRoom?: ChatRoomField;
    zaloOa?: ZaloOaField;
    repliedMessage?: MessageV1Field<ZaloMessageType>;
}
