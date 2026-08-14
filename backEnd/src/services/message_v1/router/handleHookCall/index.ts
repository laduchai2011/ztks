import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { HookCallField } from '@src/dataStruct/zalo/hookData';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { UserTakeRoomToChatBodyField } from '@src/dataStruct/chatRoom/body';

import { CacheGetChatRoomWithZaloOaIdUserIdByApp } from '@src/const/redisKey/chatRoom';
import QueryDB_UserTakeRoomToChat from '../../handleHookData/queryDB/UserTakeRoomToChat';
import { my_log } from '@src/log';
import { WaitSessionField } from '../../type';
import { prefix_cache_zalo_message_wait_session_with_zaloOaId_userIdByApp } from '@src/const/redisKey';

import { sendMessageToUser } from '../../sendMessageToUser';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

export async function hookCall_getChatRoom(
    hookData: HookCallField,
    zaloOa: ZaloOaField
): Promise<ChatRoomField | undefined> {
    const userIdByApp = hookData.user_id_by_app;
    const zaloOaId = zaloOa.id;
    const userTakeRoomToChatBody: UserTakeRoomToChatBodyField = {
        userIdByApp: userIdByApp,
        zaloOaId: zaloOaId,
    };

    const cacheGetChatRoomWithZaloOaIdUserIdByApp = new CacheGetChatRoomWithZaloOaIdUserIdByApp();
    await cacheGetChatRoomWithZaloOaIdUserIdByApp.init();
    cacheGetChatRoomWithZaloOaIdUserIdByApp.setBody({ zaloOaId: zaloOaId, userIdByApp: userIdByApp });

    const chatRoom_cache = await cacheGetChatRoomWithZaloOaIdUserIdByApp.getData();

    if (chatRoom_cache) {
        return chatRoom_cache;
    }

    const queryDB = new QueryDB_UserTakeRoomToChat();
    queryDB.setUserTakeRoomToChatBody(userTakeRoomToChatBody);

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
            const chatRoom1: ChatRoomField = result?.recordset[0];

            cacheGetChatRoomWithZaloOaIdUserIdByApp.setData(chatRoom1);

            return chatRoom1;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

export async function hookCall_feedbackToTakeChatSession(
    zaloApp: ZaloAppField,
    zaloOa: ZaloOaField,
    hookData: HookCallField
) {
    sendMessageToUser(zaloApp, zaloOa, {
        recipient: { user_id: hookData.user_id },
        message: { text: 'Vui lòng nhập mã phiên !' },
    });
}
