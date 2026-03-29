import { consumeMessage } from '@src/messageQueue/Consumer';
import { sendMessage } from '@src/messageQueue/Producer';
import Handle_CreateMessage from './handle/CreateMessage';
import {
    CreateMessageBodyField,
    messageStatus_enum,
    messageType_enum,
    messageType_type,
} from '@src/dataStruct/message';
import { sender_enum } from '@src/dataStruct/message';
import { MessageTextField, HookDataField, zalo_event_name_enum } from '@src/dataStruct/hookData';
import { my_log } from '@src/log';
import { customerSend_sendToMember_storeDB, customerSend_sendToMember_storeDB_feedback } from './const';

export function createMessageFromCustomerSend() {
    consumeMessage(customerSend_sendToMember_storeDB, (messageZalo) => {
        // console.log('consumeMessage', customerSend_sendToMember_storeDB);
        const data = messageZalo.data as HookDataField<any>;
        const message = data.message;

        let type: messageType_type = messageType_enum.TEXT;
        switch (data.event_name) {
            case zalo_event_name_enum.user_send_text: {
                type = messageType_enum.TEXT;
                break;
            }
            case zalo_event_name_enum.user_send_image: {
                type = messageType_enum.IMAGES;
                break;
            }
            case zalo_event_name_enum.user_send_video: {
                type = messageType_enum.VIDEOS;
                break;
            }
            default: {
                type = messageType_enum.TEXT;
                break;
            }
        }

        const hookData: HookDataField<MessageTextField> = {
            app_id: '',
            user_id_by_app: '',
            event_name: data.event_name,
            sender: {
                id: data.sender.id,
            },
            recipient: {
                id: data.recipient.id,
            },
            message: message,
            timestamp: '',
        };

        const createMessageBody: CreateMessageBodyField = {
            eventName: data.event_name,
            sender: sender_enum.CUSTOMER,
            senderId: data.sender.id,
            receiveId: data.sender.id,
            message: JSON.stringify(hookData),
            type: type,
            timestamp: data.timestamp,
            messageStatus: messageStatus_enum.SENT,
            accountId: messageZalo.accountId,
        };

        const handle_createMessage = new Handle_CreateMessage();
        handle_createMessage.main(createMessageBody, (message) => {
            if (message !== null) {
                sendMessage(customerSend_sendToMember_storeDB_feedback, messageZalo);
            } else {
                my_log.withRed('Lưu trữ tin nhắn khách hàng gửi lên KHÔNG thành công');
            }
        });
    });
}
