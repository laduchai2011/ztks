import { mssql_server } from '@src/connect';
import { sendMessageToUser } from '../sendMessageToUser';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { HookDataField, MessageTextField } from '@src/dataStruct/zalo/hookData';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { WaitSessionField } from '../type';
import ServiceRedis from '@src/cache/cacheRedis';
import { Zalo_Event_Name_Enum } from '@src/dataStruct/zalo/hookData/common';
import { UserTakeSessionToChatBodyField } from '@src/dataStruct/chatSession/body';
import QueryDB_UserTakeSessionToChat from '../handleHookData/queryDB/UserTakeSessionToChat';
import { my_log } from '@src/log';
import { prefix_cache_zalo_message_wait_session_with_zaloOaId_userIdByApp } from '@src/const/redisKey';

mssql_server.init();

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

const timeExpireat = 60 * 1; // 1p

export async function feedbackToTakeChatSession(
    zaloApp: ZaloAppField,
    zaloOa: ZaloOaField,
    hookData: HookDataField
): Promise<WaitSessionField | undefined> {
    const cacheMsgWaitSession_key = `${prefix_cache_zalo_message_wait_session_with_zaloOaId_userIdByApp}_${zaloOa.id}_${hookData.user_id_by_app}`;
    const eventName = hookData.event_name;
    const isUserSend = eventName.startsWith('user_send');
    // const isOaSend = eventName.startsWith('oa_send');
    // console.log(hookData);

    const waitSession = await serviceRedis.getData<WaitSessionField>(cacheMsgWaitSession_key);

    if (waitSession) {
        if (!waitSession.final) {
            let isSession: boolean = false;
            let isSessionCode: boolean = false;
            let chatSession: ChatSessionField | undefined = undefined;
            if (isUserSend) {
                // check session
                if (hookData.event_name === Zalo_Event_Name_Enum.user_send_text) {
                    const hookDataText = hookData as HookDataField<MessageTextField>;
                    const sesionInput = hookDataText.message.text.trim();
                    chatSession = await getChatSession(sesionInput, zaloOa);

                    if (chatSession) {
                        isSessionCode = true;
                    }
                }

                if (!isSessionCode) {
                    isSession = false;
                } else {
                    isSession = true;
                }
            }
            const oldHookDatas = [...waitSession.hookDatas];
            const newHookDatas: HookDataField[] = [...oldHookDatas, hookData];
            let current_final = false;
            const current_index = waitSession.index + 1;
            if (waitSession.index === waitSession.maxIndex || isSessionCode) {
                current_final = true;
            }
            const new_waitSession: WaitSessionField = {
                hookDatas: newHookDatas,
                isSession: isSession,
                index: current_index,
                maxIndex: waitSession.maxIndex,
                final: current_final,
                chatSession: chatSession,
            };
            const isSet = await serviceRedis.setData<WaitSessionField>(
                cacheMsgWaitSession_key,
                new_waitSession,
                timeExpireat
            );
            if (!isSet) {
                console.error('Failed to set zaloApp in cookie in Redis (feedbackToTakeSessionCode)');
                serviceRedis.deleteData(cacheMsgWaitSession_key);
                sendMessageToUser(zaloApp, zaloOa, {
                    recipient: { user_id: hookData.sender.id },
                    message: { text: 'Đã có lỗi xả ra, vui lòng thực hiện lại !' },
                });
            }

            if (isUserSend) {
                if (!current_final) {
                    sendMessageToUser(zaloApp, zaloOa, {
                        recipient: { user_id: hookData.sender.id },
                        message: { text: 'Phiên này không tồn tại, vui lòng nhập lại !' },
                    });
                } else {
                    if (!isSessionCode) {
                        sendMessageToUser(zaloApp, zaloOa, {
                            recipient: { user_id: hookData.sender.id },
                            message: {
                                text: 'Bạn đã nhập sai quá số lần cho phép, chúng tôi sẽ chỉ định nhân viên chăm sóc cho bạn !',
                            },
                        });
                    } else {
                        sendMessageToUser(zaloApp, zaloOa, {
                            recipient: { user_id: hookData.sender.id },
                            message: { text: 'Bạn đã chọn được nhân viên chăm sóc, vui lòng chờ !' },
                        });
                    }
                }
            }
        } else {
            const oldHookDatas = [...waitSession.hookDatas];
            const newHookDatas: HookDataField[] = [...oldHookDatas, hookData];
            const new_waitSession: WaitSessionField = {
                hookDatas: newHookDatas,
                isSession: waitSession.isSession,
                index: waitSession.index,
                maxIndex: waitSession.maxIndex,
                final: waitSession.final,
                chatSession: waitSession.chatSession,
            };
            const isSet = await serviceRedis.setData<WaitSessionField>(
                cacheMsgWaitSession_key,
                new_waitSession,
                timeExpireat
            );
            if (!isSet) {
                console.error('Failed to set zaloApp in cookie in Redis (feedbackToTakeSessionCode)');
                serviceRedis.deleteData(cacheMsgWaitSession_key);
                sendMessageToUser(zaloApp, zaloOa, {
                    recipient: { user_id: hookData.sender.id },
                    message: { text: 'Đã có lỗi xả ra, vui lòng thực hiện lại !' },
                });
            }

            const waitSession_final = await serviceRedis.getData<WaitSessionField>(cacheMsgWaitSession_key);
            serviceRedis.deleteData(cacheMsgWaitSession_key);
            if (!waitSession_final) {
                return;
            }
            return waitSession_final;
        }
    } else {
        if (isUserSend) {
            const new_waitSession: WaitSessionField = {
                hookDatas: [hookData],
                isSession: false,
                index: 0,
                maxIndex: 5,
                final: false,
            };
            const isSet = await serviceRedis.setData<WaitSessionField>(
                cacheMsgWaitSession_key,
                new_waitSession,
                timeExpireat
            );
            sendMessageToUser(zaloApp, zaloOa, {
                recipient: { user_id: hookData.sender.id },
                message: { text: 'Vui lòng gửi phiên hội thoại để xác định nhân viên phục vụ !' },
            });
            if (!isSet) {
                console.error('Failed to set zaloApp in cookie in Redis (feedbackToTakeSessionCode)');
                sendMessageToUser(zaloApp, zaloOa, {
                    recipient: { user_id: hookData.sender.id },
                    message: { text: 'Vui lòng thực hiện lại tin nhắn đã gửi !' },
                });
            }
        }
    }
}

async function getChatSession(code: string, zaloOa: ZaloOaField): Promise<ChatSessionField | undefined> {
    // console.log(11111111, zaloOa);
    const userTakeSessionToChatBody: UserTakeSessionToChatBodyField = {
        code: code,
        zaloOaId: zaloOa.id,
    };

    const queryDB = new QueryDB_UserTakeSessionToChat();
    queryDB.setUserTakeSessionToChatBody(userTakeSessionToChatBody);

    const connection_pool = mssql_server.get_connectionPool();
    if (connection_pool) {
        queryDB.set_connection_pool(connection_pool);
    } else {
        my_log.withYellow('Kết nối cơ sở dữ liệu không thành công !');
        return;
    }

    try {
        const result = await queryDB.run();
        if (result?.recordset.length && result?.recordset.length > 0) {
            const chatSession: ChatSessionField = result?.recordset[0];
            return chatSession;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}
