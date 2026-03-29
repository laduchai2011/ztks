import { consumeMessage } from '@src/messageQueue/Consumer';
import { sendMessage } from '@src/messageQueue/Producer';
import Handle_GetAMyCustomer from './handle/GetAMyCustomer';
import Handle_CreateMyCustom from './handle/CreateMyCustom';
import Handle_UpdateEvent_MemberSend from './handle/UpdateEvent_MemberSend';
import { AccountField } from '@src/dataStruct/account';
import ServiceRedis from '@src/cache/cacheRedis';
import { zalo_event_name_enum_messageQueue } from '@src/dataStruct/hookData';
import { UpdateEventMemberSendBodyField, messageStatus_enum } from '@src/dataStruct/message';
import { MessageZaloField } from '@src/messageQueue/type';
import { redisKey_memberReceiveMessage } from '@src/const/redisKey';
import {
    customerSend_sendToMember_storeDB,
    customerSend_sendToMember_storeDB_feedback,
    customerSend_sendToMember,
} from './const';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

function checkMyCustommer() {
    consumeMessage(zalo_event_name_enum_messageQueue.user_send_text, (messageZalo) => {
        // console.log('user_send_text', messageZalo);
        main(messageZalo);
    });

    consumeMessage(zalo_event_name_enum_messageQueue.user_send_image, (messageZalo) => {
        main(messageZalo);
    });

    consumeMessage(zalo_event_name_enum_messageQueue.user_send_video, (messageZalo) => {
        main(messageZalo);
    });

    const main = (messageZalo: MessageZaloField) => {
        const handle_getAMyCustomer = new Handle_GetAMyCustomer();
        const handle_createMyCustom = new Handle_CreateMyCustom();

        handle_getAMyCustomer.main({ senderId: messageZalo.data.sender.id }, async (myCustomer) => {
            const messageZalo1 = { ...messageZalo };
            if (myCustomer) {
                messageZalo1.accountId = myCustomer.accountId;
                messageZalo1.isNewCustom = false;
            } else {
                const key = redisKey_memberReceiveMessage;
                try {
                    const result = await serviceRedis.getData<AccountField>(key);
                    if (result === null) {
                        console.error('Could not get account from Redis');
                        return;
                    }
                    messageZalo1.accountId = result.id;
                    messageZalo1.isNewCustom = false;

                    handle_createMyCustom.main(
                        {
                            senderId: messageZalo1.data.sender.id,
                            accountId: messageZalo1.accountId,
                        },
                        (myCustomer) => {
                            if (myCustomer) {
                                console.log('Tạo MyCustom thành công !');
                            } else {
                                console.log('Tạo MyCustom không thành công !');
                            }
                        }
                    );
                } catch (error) {
                    console.error(error);
                }
            }

            sendMessage(customerSend_sendToMember_storeDB, messageZalo1);
        });
    };
}

function sendToMember() {
    consumeMessage(customerSend_sendToMember_storeDB_feedback, (messageZalo) => {
        console.log('consumeMessage', customerSend_sendToMember_storeDB_feedback);
        sendMessage(customerSend_sendToMember, messageZalo);
    });
}

function updateEvent_MemberSend() {
    consumeMessage(zalo_event_name_enum_messageQueue.oa_send_text, (messageZalo) => {
        // console.log('updateEvent_MemberSend', 'oa_send_text', messageZalo);
        update(messageZalo);
    });
    consumeMessage(zalo_event_name_enum_messageQueue.oa_send_image, (messageZalo) => {
        // const data = messageZalo.data as HookDataField<MessageImageOaSendField>;
        // console.log('updateEvent_MemberSend', 'oa_send_image', messageZalo, data.message, data.message.attachments);
        update(messageZalo);
    });

    const update = (messageZalo: MessageZaloField) => {
        const handle_getAMyCustomer = new Handle_GetAMyCustomer();

        handle_getAMyCustomer.main({ senderId: messageZalo.data.recipient.id }, async (myCustomer) => {
            const messageZalo1 = { ...messageZalo };
            if (myCustomer) {
                messageZalo1.accountId = myCustomer.accountId;
                messageZalo1.isNewCustom = false;
            } else {
                const key = redisKey_memberReceiveMessage;
                try {
                    const result = await serviceRedis.getData<AccountField>(key);
                    if (result === null) {
                        console.error('Could not get account from Redis');
                        return;
                    }
                    messageZalo1.accountId = result.id;
                    messageZalo1.isNewCustom = false;
                } catch (error) {
                    console.error(error);
                }
            }

            main(messageZalo1);
        });
    };

    const main = (message: MessageZaloField) => {
        const handle_updateEvent_memberSend = new Handle_UpdateEvent_MemberSend();

        const updateEventMemberSendBody: UpdateEventMemberSendBodyField = {
            eventName: message.data.event_name,
            receiveId: message.data.recipient.id,
            timestamp: message.data.timestamp,
            messageStatus: messageStatus_enum.SENT,
            accountId: message.accountId,
        };

        // console.log('receiveId', message.data.recipient);

        handle_updateEvent_memberSend.main(updateEventMemberSendBody, (message) => {
            if (message) {
                console.log('UpdateEvent_MemberSend', 'Cập nhật thành công !');
            } else {
                console.log('UpdateEvent_MemberSend', 'Cập nhật không thành công !');
            }
        });
    };
}

export { checkMyCustommer, sendToMember, updateEvent_MemberSend };
