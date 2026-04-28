import { consumeHookData } from '@src/messageQueue/Consumer';
import { sendStringMessage } from '@src/messageQueue/Producer';
import {
    MessageSchemaType,
    MessageZodSchema,
    NewMessageSchemaType,
    NewMessageZodSchema,
    MessageAmountInDaySchema,
    MessageAmountInDayType,
    getDateKeyVN,
} from '@src/schema/message';
import { NewMessageV1Field, MessageAmountInDayField } from '@src/dataStruct/message_v1';
import { ChatRoomRoleZodSchema } from '@src/schema/chatRoom';
import { SocketMessageField, MessageV1Field } from '@src/dataStruct/message_v1';
import { getDbMonggo } from '@src/connect/mongo';
import { my_log } from '@src/log';
import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { AccountReceiveMessageField } from '@src/dataStruct/account';
import { GetAccountReceiveMessageBodyField } from '@src/dataStruct/account/body';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { ChatRoomField, ChatRoomRoleSchema } from '@src/dataStruct/chatRoom';
import { ChatRoomRoleSchemaType } from '@src/schema/chatRoom';
import { UserTakeRoomToChatBodyField, ChatRoomBodyField } from '@src/dataStruct/chatRoom/body';
import { CheckZaloAppWithAppIdBodyField, CheckZaloOaListWithZaloAppIdBodyField } from '@src/dataStruct/zalo/body';
import QueryDB_CheckZaloAppWithAppId from './handleHookData/queryDB/CheckZaloAppWithAppId';
import QueryDB_CheckZaloOaListWithZaloAppId from './handleHookData/queryDB/CheckZaloOaListWithZaloAppId';
import QueryDB_UserTakeRoomToChat from './handleHookData/queryDB/UserTakeRoomToChat';
import QueryDB_GetAccountReceiveMessage from './handleHookData/queryDB/GetAccountReceiveMessage';
import QueryDB_GetAllChatRoomRolesWithChatRoomId from './handleHookData/queryDB/GetAllChatRoomRolesWithChatRoomId';
import MutateDB_CreateChatRoom from './handleHookData/mutateDB/CreateChatRoom';
import { prefix_cache_zaloApp_with_appId, prefix_cache_zaloOa_list_with_zaloAppId } from '@src/const/redisKey';
import { CacheGetAllChatRoomRoleWithCrid, CacheGetChatRoomWithZaloOaIdUserIdByApp } from '@src/const/redisKey/chatRoom';
import { IsPassField, WaitSessionField } from './type';
import {
    HookDataField,
    HookDataSchema,
    ZaloMessageType,
    MessageVideoField,
    MessageTextField,
} from '@src/dataStruct/zalo/hookData';
import { feedbackToTakeChatSession } from './handleHookData/feedbackToTakeChatSession';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { sendMessageToUser } from './sendMessageToUser';
import { ensureIndexes } from './handleHookData/ensureIndexes';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';
import { Zalo_Event_Name_Enum } from '@src/dataStruct/zalo/hookData/common';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

mssql_server.init();

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

ensureIndexes();

const timeExpireat = 60 * 3; // 3p

export function hookData() {
    consumeHookData(`zalo_hook_data_queue${prefix}`, async (data) => {
        // console.log('Hook Data Received:');
        // console.dir(data, { depth: null });
        const app_id = data.app_id;
        const oa_id = determineOaId(data);
        const sender_id_of_user = determineSenderIdOfUser(data);
        let chatRoom: ChatRoomField | undefined;

        if (!oa_id) return;

        const { isPass, zaloApp, zaloOa } = await isPass_App_Oa(app_id, oa_id);

        if (!isPass) return;
        if (!zaloApp) return;
        if (!zaloOa) return;

        // get chat room
        chatRoom = await getChatRoom(data, zaloOa);
        // console.log(1111, chatRoom);
        let isFeedback: boolean = false;
        let waitSession: WaitSessionField | undefined = undefined;

        if (!chatRoom) {
            // feedback to take session-code
            waitSession = await feedbackToTakeChatSession(zaloApp, zaloOa, data);
            isFeedback = true;

            if (!waitSession) {
                return;
            }
            // console.dir(waitSession, { depth: null });
            const chatSession = waitSession.chatSession;
            if (!chatSession) {
                // get default chat session
                const chatSessionAdmin: ChatSessionField = {
                    id: -1,
                    label: '',
                    code: '',
                    isReady: true,
                    status: '',
                    selectedAccountId: zaloApp.accountId,
                    zaloOaId: -1,
                    accountId: -1,
                    updateTime: '',
                    createTime: '',
                };
                const getAccountReceiveMessage = await GetAccountReceiveMessage(zaloApp.accountId, zaloOa.id);
                if (getAccountReceiveMessage?.accountIdReceiveMessage) {
                    chatSessionAdmin.selectedAccountId = getAccountReceiveMessage.accountIdReceiveMessage;
                }
                chatRoom = await createChatRoom(zaloOa, data, chatSessionAdmin);
            } else {
                const getAccountReceiveMessage = await GetAccountReceiveMessage(zaloApp.accountId, zaloOa.id);
                if (getAccountReceiveMessage?.accountIdReceiveMessage) {
                    chatSession.selectedAccountId = getAccountReceiveMessage.accountIdReceiveMessage;
                }
                chatRoom = await createChatRoom(zaloOa, data, chatSession);
            }

            if (chatRoom) {
                createChatRoomRoleMongo(chatRoom, zaloOa);
            }
        }

        // console.log(1111, chatRoom);
        if (!chatRoom) return;

        if (isFeedback && waitSession) {
            // store message then feedback
            const hookDatas = waitSession.hookDatas;
            const hookDataSchemas: HookDataSchema[] = [];
            for (let i: number = 0; i < hookDatas.length; i++) {
                const hookDataSchema: HookDataSchema = {
                    event_name: hookDatas[i].event_name,
                    app_id: hookDatas[i].app_id,
                    oa_id: oa_id,
                    chat_room_id: chatRoom?.id || -1,
                    user_id_by_app: hookDatas[i].user_id_by_app,
                    sender_id: hookDatas[i].sender.id,
                    recipient_id: hookDatas[i].recipient.id,
                    reply_account_id: chatRoom?.accountId || -1,
                    message_id: hookDatas[i].message.msg_id,
                    message: hookDatas[i].message,
                    is_seen: false,
                    timestamp: parseTimestamp(hookDatas[i].timestamp),
                };
                hookDataSchemas.push(hookDataSchema);
            }

            const hookDatasMessage = MessageZodSchema.array().safeParse(hookDataSchemas);

            if (!hookDatasMessage.success) {
                console.error('Invalid message format:', hookDatasMessage.error);
            } else {
                const ops = hookDatasMessage.data.map((doc) => ({
                    insertOne: { document: doc },
                }));
                const dbMonggo = getDbMonggo();
                const kq = await dbMonggo.collection<MessageSchemaType>('message').bulkWrite(ops, { ordered: false });
                // console.log(33333333, kq);
                if (kq) {
                    if (!sender_id_of_user) return;
                    sendMessageToUser(zaloApp, zaloOa, {
                        recipient: { user_id: sender_id_of_user },
                        message: {
                            text: 'Bây giờ bạn có thể bắt đầu cuộc hội thoại !',
                        },
                    });
                }
            }
        } else {
            const keyRedis = `replyAccountId_with_message_id_${data.message.msg_id}`;

            let reply_account_id: number | null = null;
            reply_account_id = await serviceRedis.getData<number>(keyRedis);

            if (!reply_account_id) {
                reply_account_id = -1; // phai dung truoc khi xu ly tin nhan, de tranh tinh trang bi thieu reply_account_id khi gui tin nhan video
                // dùng khi gửi tin nhắn video
                if (data.event_name === Zalo_Event_Name_Enum.oa_send_text) {
                    const data1 = data as HookDataField<MessageTextField>;
                    const messageText = data1.message.text;
                    const [maPart, urlPart] = messageText.split(',duongdan:');
                    const fileName = maPart.replace('ma:', '');
                    const parts = fileName.split('-');
                    const accountId = parts[1];
                    const url = urlPart;

                    reply_account_id = Number(accountId);

                    const hookDataSchema_sendVideo = await getWaitVideoMessage(reply_account_id);
                    if (hookDataSchema_sendVideo && data1.message.quote_msg_id) {
                        hookDataSchema_sendVideo.message_id = data1.message.quote_msg_id;
                        hookDataSchema_sendVideo.message.msg_id = data1.message.quote_msg_id;
                        hookDataSchema_sendVideo.message.attachments[0].payload.url = url;

                        const parsedMessage = MessageZodSchema.safeParse(hookDataSchema_sendVideo);
                        if (!parsedMessage.success) {
                            console.error('Invalid message format:', parsedMessage.error);
                        } else {
                            try {
                                const dbMonggo = getDbMonggo();
                                const dataParse = parsedMessage.data;
                                const kq_message = await dbMonggo
                                    .collection<MessageSchemaType>('message')
                                    .insertOne(dataParse);

                                const { _id, ...doc } = dataParse as any;

                                // phuc vu realtime
                                const allChatRoomRoles = await GetAllChatRoomRolesWithChatRoomId(chatRoom.id);
                                if (allChatRoomRoles) {
                                    const socketMsg: SocketMessageField = {
                                        chatRoomId: doc.chat_room_id,
                                        _id: kq_message.insertedId.toString(),
                                        allChatRoomRoles: allChatRoomRoles,
                                    };

                                    sendStringMessage(`store_msg_success${prefix}`, JSON.stringify(socketMsg));
                                }
                            } catch (error) {
                                console.error('Error inserting message to MongoDB:', error);
                            }
                        }
                    }
                }
            }

            const hookDataSchema: HookDataSchema = {
                event_name: data.event_name,
                app_id: data.app_id,
                oa_id: oa_id,
                chat_room_id: chatRoom?.id || -1,
                user_id_by_app: data.user_id_by_app,
                sender_id: data.sender.id,
                recipient_id: data.recipient.id,
                reply_account_id: reply_account_id,
                message_id: data.message.msg_id,
                message: data.message,
                is_seen: false,
                timestamp: parseTimestamp(data.timestamp),
            };

            const parsedMessage = MessageZodSchema.safeParse(hookDataSchema);

            if (!parsedMessage.success) {
                console.error('Invalid message format:', parsedMessage.error);
            } else {
                const dbMonggo = getDbMonggo();
                const dataParse = parsedMessage.data;
                const kq_message = await dbMonggo.collection<MessageSchemaType>('message').insertOne(dataParse);

                const { _id, ...doc } = dataParse as any;

                await dbMonggo
                    .collection<MessageSchemaType>('lastMessage')
                    .updateOne({ chat_room_id: doc.chat_room_id }, { $set: doc }, { upsert: true });

                // phuc vu realtime
                const allChatRoomRoles = await GetAllChatRoomRolesWithChatRoomId(chatRoom.id);
                if (allChatRoomRoles) {
                    const socketMsg: SocketMessageField = {
                        chatRoomId: doc.chat_room_id,
                        _id: kq_message.insertedId.toString(),
                        allChatRoomRoles: allChatRoomRoles,
                    };

                    sendStringMessage(`store_msg_success${prefix}`, JSON.stringify(socketMsg));
                }
            }

            // thiết lập newMessage để xem tin nhắn mới chưa xem
            const allChatRoomRoles = await GetAllChatRoomRolesWithChatRoomId(chatRoom.id);
            if (allChatRoomRoles) {
                for (let i: number = 0; i < allChatRoomRoles.length; i++) {
                    const newMessage: NewMessageV1Field<ZaloMessageType> = {
                        ...hookDataSchema,
                        account_id: allChatRoomRoles[i].authorizedAccountId,
                        created_at: new Date(),
                    };

                    const parsedNewMessage = NewMessageZodSchema.safeParse(newMessage);

                    if (!parsedNewMessage.success) {
                        console.error('Invalid message format:', parsedNewMessage.error);
                    } else {
                        const dbMonggo = getDbMonggo();
                        const dataNewMessageParse = parsedNewMessage.data;
                        await dbMonggo.collection<NewMessageSchemaType>('newMessage').insertOne(dataNewMessageParse);
                    }
                }
            }

            //cập nhật số lượng tin nhắn trong ngày
            const isOaSend = data.event_name.startsWith('oa_send');
            if (isOaSend && reply_account_id && reply_account_id !== -1) {
                updateMessageAmountInDay(reply_account_id, 1);
            }
        }
    });
}

async function isPass_App_Oa(app_id: string, oa_id: string): Promise<IsPassField> {
    const checkZaloAppWithAppIdBody: CheckZaloAppWithAppIdBodyField = {
        appId: app_id,
    };
    const zaloApp = await checkZaloApp(checkZaloAppWithAppIdBody);
    if (!zaloApp) return { isPass: false, zaloApp: null, zaloOa: null };

    const checkZaloOaListWithZaloAppIdBody: CheckZaloOaListWithZaloAppIdBodyField = {
        zaloAppId: zaloApp.id,
    };
    const zaloOaList = await checkZaloOa(checkZaloOaListWithZaloAppIdBody);
    if (!zaloOaList) return { isPass: false, zaloApp: zaloApp, zaloOa: null };
    let existOA: boolean = false;
    let oa_in_index: number = -1;
    for (let i: number = 0; i < zaloOaList.length; i++) {
        if (oa_id === zaloOaList[i].oaId) {
            existOA = true;
            oa_in_index = i;
            break;
        }
    }

    if (existOA) {
        return { isPass: true, zaloApp: zaloApp, zaloOa: zaloOaList[oa_in_index] };
    }
    return { isPass: false, zaloApp: zaloApp, zaloOa: null };
}

async function checkZaloApp(
    checkZaloAppWithAppIdBody: CheckZaloAppWithAppIdBodyField
): Promise<ZaloAppField | undefined> {
    const app_id = checkZaloAppWithAppIdBody.appId;
    const keyRedis = `${prefix_cache_zaloApp_with_appId}_${app_id}`;
    const zaloApp = await serviceRedis.getData<ZaloAppField>(keyRedis);

    if (zaloApp) {
        return zaloApp;
    }

    const queryDB = new QueryDB_CheckZaloAppWithAppId();
    queryDB.setCheckZaloAppWithAppIdBody(checkZaloAppWithAppIdBody);

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
            const zaloApp1: ZaloAppField = { ...result?.recordset[0] };

            const isSet = await serviceRedis.setData<ZaloAppField>(keyRedis, zaloApp1, timeExpireat);
            if (!isSet) {
                console.error('Failed to set zaloApp in cookie in Redis');
                return;
            }

            return zaloApp1;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function checkZaloOa(
    checkZaloOaListWithZaloAppIdBody: CheckZaloOaListWithZaloAppIdBodyField
): Promise<ZaloOaField[] | undefined> {
    const zaloAppId = checkZaloOaListWithZaloAppIdBody.zaloAppId;
    const keyRedis = `${prefix_cache_zaloOa_list_with_zaloAppId}_${zaloAppId}`;
    const zaloOaList = await serviceRedis.getData<ZaloOaField[]>(keyRedis);

    if (zaloOaList) {
        return zaloOaList;
    }

    const queryDB = new QueryDB_CheckZaloOaListWithZaloAppId();
    queryDB.setCheckZaloOaListWithZaloAppIdBody(checkZaloOaListWithZaloAppIdBody);

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
            const zaloOaList: ZaloOaField[] = result?.recordset;

            const isSet = await serviceRedis.setData<ZaloOaField[]>(keyRedis, zaloOaList, timeExpireat);
            if (!isSet) {
                console.error('Failed to set zaloApp in cookie in Redis');
                return;
            }

            return zaloOaList;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

function determineOaId(hookData: HookDataField): string | null {
    const eventName = hookData.event_name;
    let oa_id: string | null = null;
    const isUserSend = eventName.startsWith('user_send');
    const isOaSend = eventName.startsWith('oa_send');

    if (isUserSend) {
        oa_id = hookData.recipient.id;
    }

    if (isOaSend) {
        oa_id = hookData.sender.id;
    }

    return oa_id;
}

function determineSenderIdOfUser(hookData: HookDataField): string | null {
    const eventName = hookData.event_name;
    let oa_id: string | null = null;
    const isUserSend = eventName.startsWith('user_send');
    const isOaSend = eventName.startsWith('oa_send');

    if (isUserSend) {
        oa_id = hookData.sender.id;
    }

    if (isOaSend) {
        oa_id = hookData.recipient.id;
    }

    return oa_id;
}

async function getChatRoom(hookData: HookDataField, zaloOa: ZaloOaField): Promise<ChatRoomField | undefined> {
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

async function createChatRoom(zaloOa: ZaloOaField, hookData: HookDataField, chatSession: ChatSessionField) {
    const chatRoomBody: ChatRoomBodyField = {
        userIdByApp: hookData.user_id_by_app,
        zaloOaId: zaloOa.id,
        accountId: chatSession.selectedAccountId,
    };

    const queryDB = new MutateDB_CreateChatRoom();
    queryDB.setChatRoomBody(chatRoomBody);

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
            const chatRoom: ChatRoomField = result?.recordset[0];

            return chatRoom;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function createChatRoomRoleMongo(chatRoom: ChatRoomField, zaloOa: ZaloOaField) {
    const chatRommRoleSchema: ChatRoomRoleSchema = {
        authorized_account_id: chatRoom.accountId,
        is_read: true,
        is_send: true,
        chat_room_id: chatRoom.id,
        zalo_oa_id: zaloOa.id,
        account_id: chatRoom.accountId,
    };
    const parsedChatRoomRole = ChatRoomRoleZodSchema.safeParse(chatRommRoleSchema);
    if (!parsedChatRoomRole.success) {
        console.error('Invalid chatRoomRole format:', parsedChatRoomRole.error);
    } else {
        const dbMonggo = getDbMonggo();
        const dataParse = parsedChatRoomRole.data;
        await dbMonggo.collection<ChatRoomRoleSchemaType>('chatRoomRole').insertOne(dataParse);
    }
}

async function GetAccountReceiveMessage(selectedAccountId: number, zaloOaId: number) {
    const getAccountReceiveMessageBody: GetAccountReceiveMessageBodyField = {
        zaloOaId: zaloOaId,
        accountId: selectedAccountId,
    };

    const queryDB = new QueryDB_GetAccountReceiveMessage();
    queryDB.setGetAccountReceiveMessageBody(getAccountReceiveMessageBody);

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
            const accountReceiveMessage: AccountReceiveMessageField = result?.recordset[0];
            return accountReceiveMessage;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function GetAllChatRoomRolesWithChatRoomId(chatRoomId: number) {
    const cacheGetAllChatRoomRoleWithCrid = new CacheGetAllChatRoomRoleWithCrid();
    await cacheGetAllChatRoomRoleWithCrid.init();

    cacheGetAllChatRoomRoleWithCrid.setBody({ chatRoomId: chatRoomId });
    const allChatRoomRole_cache = await cacheGetAllChatRoomRoleWithCrid.getData();

    if (allChatRoomRole_cache) {
        return allChatRoomRole_cache;
    }

    const queryDB = new QueryDB_GetAllChatRoomRolesWithChatRoomId();
    queryDB.setChatRoomId(chatRoomId);

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
            const rAllData = result?.recordset;

            cacheGetAllChatRoomRoleWithCrid.setData(rAllData);

            return rAllData;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

function parseTimestamp(ts: string) {
    const n = Number(ts);

    if (!Number.isNaN(n)) {
        if (ts.length === 10) return new Date(n * 1000);
        if (ts.length === 13) return new Date(n);
    }

    return new Date(ts); // ISO string
}

async function updateMessageAmountInDay(account_id: number, amount: number) {
    const now = new Date();
    const dateKey = getDateKeyVN(now);

    const db = getDbMonggo();
    const col = db.collection<MessageAmountInDayType>('messageAmountInDay');

    const existing = await col.findOne<MessageAmountInDayField>({
        account_id: account_id,
        dateKey: dateKey,
    });

    if (existing) {
        const oldAmount = existing.amount;
        await col.updateOne({ account_id: account_id, dateKey: dateKey }, { $set: { amount: oldAmount + 1 } });
    } else {
        const newMessageAmountInDay: MessageAmountInDayField = {
            account_id: account_id,
            dateKey: dateKey,
            timestamp: now,
            amount: amount,
        };
        const parsed = MessageAmountInDaySchema.safeParse(newMessageAmountInDay);

        if (!parsed.success) {
            console.error('Invalid newMessageAmountInDay format:', parsed.error);
        } else {
            await col.insertOne(parsed.data);
        }
    }
}

async function getWaitVideoMessage(reply_account_id: number): Promise<MessageV1Field<MessageVideoField> | undefined> {
    // const db = getDbMonggo();
    // const col = db.collection<MessageV1Field<MessageVideoField>>('waitVideoMessage');

    // const data = await col
    //     .find<MessageV1Field<MessageVideoField>>({ reply_account_id }, { projection: { _id: 0 } })
    //     .sort({ timestamp: -1 })
    //     .limit(1)
    //     .toArray();

    // return data.length > 0 ? data[0] : undefined;
    const db = getDbMonggo();
    const col = db.collection<MessageV1Field<MessageVideoField>>('waitVideoMessage');

    const result = await col.findOneAndDelete(
        { reply_account_id },
        {
            sort: { timestamp: -1 }, // lấy mới nhất
            projection: { _id: 0 },
        }
    );

    return result ?? undefined;
}
