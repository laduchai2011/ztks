import { consume_Hook_Data } from '@src/messageQueue/Consumer';
import { sendStringMessage } from '@src/messageQueue/Producer';
import {
    Message_Schema_Type,
    Message_Zod_Schema,
    New_Message_Schema_Type,
    New_Message_Zod_Schema,
    Message_Amount_In_Day_Schema,
    Message_Amount_In_Day_Type,
    Call_Zod_Schema,
    get_Date_Key_VN,
} from '@src/schema/message';
import { New_Message_V1_Field, Message_Amount_In_Day_Field, New_Call_V1_Field } from '@src/data_struct/message_v1';
import { Chat_Room_Role_Zod_Schema, Chat_Room_Role_Schema_Type } from '@src/schema/chatRoom';
import { Socket_Message_Field, Message_V1_Field } from '@src/data_struct/message_v1';
import { get_Db_Monggo } from '@src/connect/mongo';
import { my_log } from '@src/log';
// import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Account_Receive_Message_Field } from '@src/data_struct/account';
import { Get_Account_Receive_Message_Body_Field } from '@src/data_struct/account/body';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Chat_Room_Field, Chat_Room_Role_Schema } from '@src/data_struct/chat_room';
import { User_Take_Room_To_Chat_Body_Field, Chat_Room_Body_Field } from '@src/data_struct/chat_room/body';
import {
    Check_Zalo_App_With_App_Id_Body_Field,
    Check_Zalo_Oa_List_With_Zalo_App_Id_Body_Field,
} from '@src/data_struct/zalo/body';
import QueryDB_Check_Zalo_App_With_App_Id from './handleHookData/queryDB/Check_Zalo_App_With_App_Id';
import QueryDB_Check_Zalo_Oa_List_With_Zalo_App_Id from './handleHookData/queryDB/Check_Zalo_Oa_List_With_Zalo_App_Id';
import QueryDB_User_Take_Room_To_Chat from './handleHookData/queryDB/User_Take_Room_To_Chat';
import QueryDB_Get_Account_Receive_Message from './handleHookData/queryDB/Get_Account_Receive_Message';
import QueryDB_Get_All_Chat_Room_Roles_With_Chat_Room_Id from './handleHookData/queryDB/Get_All_Chat_Room_Roles_With_Chat_Room_Id';
import MutateDB_Create_Chat_Room from './handleHookData/mutateDB/Create_Chat_Room';
import { prefix_cache__zalo_app_with_app_id, prefix_cache__zalo_oa_list_with_zalo_app_id } from '@src/const/redisKey';
import {
    Cache_Get_All_Chat_Room_Role_With_Crid,
    Cache_Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App,
} from '@src/const/redisKey/chat_room';
import { Is_Pass_Field, Wait_Session_Field } from './type';
import {
    Hook_Data_Field,
    Hook_Data_Schema,
    Zalo_Message_Type,
    Message_Video_Field,
    Message_Text_Field,
    Hook_Call_Field,
    Hook_Call_Schema,
    Zalo_Call_Type,
} from '@src/data_struct/zalo/hook_data';
import { feedback_To_Take_Chat_Session } from './handleHookData/feedback_To_Take_Chat_Session';
import { Chat_Session_Field } from '@src/data_struct/chat_session';
import { send_Message_To_User } from './send_Message_To_User';
import { ensureIndexes } from './handleHookData/ensureIndexes';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';
import { Zalo_Event_Name_Enum } from '@src/data_struct/zalo/hook_data/common';
import handleCreateCallPermit from './handleCreateCallPermit';
import { hookCall_getChatRoom, hookCall_feedbackToTakeChatSession } from './handleHookCall';

const prefix = getEnv() === myEnv.Dev ? 'dev' : '';

// mssql_server.init();

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

ensureIndexes();

const time_expireat = 60 * 3; // 3p

export function hookData() {
    consume_Hook_Data(`zalo_hook_data_queue_${prefix}`, async (data) => {
        try {
            // const chatRommRoleSchema: ChatRoomRoleSchema = {
            //     authorized_account_id: 1,
            //     is_read: true,
            //     is_send: true,
            //     chat_room_id: 2,
            //     zalo_oa_id: 1,
            //     account_id: 1,
            // };
            // const parsedChatRoomRole = ChatRoomRoleZodSchema.safeParse(chatRommRoleSchema);
            // if (!parsedChatRoomRole.success) {
            //     console.error('Invalid chatRoomRole format:', parsedChatRoomRole.error);
            // } else {
            //     const dbMonggo = getDbMonggo();
            //     const dataParse = parsedChatRoomRole.data;
            //     await dbMonggo.collection<ChatRoomRoleSchemaType>('chatRoomRole').insertOne(dataParse);
            // }
            // console.log('Hook Data Received:');
            // console.dir(data, { depth: null });
            // if (data.event_name.startsWith('user_call') || data.event_name.startsWith('oa_call')) {
            if (
                data.event_name === Zalo_Event_Name_Enum.oa_send_template ||
                data.event_name === Zalo_Event_Name_Enum.user_send_template
            ) {
                return;
            } else {
                if ('call_id' in data) {
                    const app_id = data.app_id;
                    const oa_id = data.oa_id;
                    let chat_room: Chat_Room_Field | undefined = undefined;

                    const { isPass, zaloApp, zaloOa } = await isPass_App_Oa(app_id, oa_id);
                    if (!isPass) return;
                    if (!zaloApp) return;
                    if (!zaloOa) return;

                    chatRoom = await hookCall_getChatRoom(data, zaloOa);

                    if (!chatRoom) {
                        hookCall_feedbackToTakeChatSession(zaloApp, zaloOa, data);
                        return;
                    }

                    const hookCallSchema: HookCallSchema = {
                        event_name: data.event_name,
                        app_id: data.app_id,
                        oa_id: oa_id,
                        chat_room_id: chatRoom?.id || -1,
                        user_id_by_app: data.user_id_by_app,
                        user_id: data.user_id,
                        call_id: data.call_id,
                        call_type: data.call_type,
                        waiting_time: data.waiting_time,
                        init_time: data.init_time,
                        call_duration: data.call_duration,
                        talk_time: data.talk_time,
                        status_code: data.status_code,
                        reply_account_id: chatRoom?.accountId || -1,
                        is_seen: false,
                        timestamp: parseTimestamp(data.timestamp),
                    };

                    const parsedCall = CallZodSchema.safeParse(hookCallSchema);

                    if (!parsedCall.success) {
                        console.error('Invalid call format:', parsedCall.error);
                    } else {
                        const dbMonggo = getDbMonggo();
                        const dataParse = parsedCall.data;
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

                            sendStringMessage(`store_msg_success_${prefix}`, JSON.stringify(socketMsg));
                        }
                    }

                    // thiết lập newMessage để xem tin nhắn mới chưa xem
                    const allChatRoomRoles = await GetAllChatRoomRolesWithChatRoomId(chatRoom.id);
                    if (allChatRoomRoles) {
                        for (let i: number = 0; i < allChatRoomRoles.length; i++) {
                            const newCall: NewCallV1Field<ZaloCallType> = {
                                ...hookCallSchema,
                                account_id: allChatRoomRoles[i].authorizedAccountId,
                                created_at: new Date(),
                            };

                            const parsedNewMessage = NewMessageZodSchema.safeParse(newCall);

                            if (!parsedNewMessage.success) {
                                console.error('Invalid message format:', parsedNewMessage.error);
                            } else {
                                const dbMonggo = getDbMonggo();
                                const dataNewMessageParse = parsedNewMessage.data;
                                await dbMonggo
                                    .collection<NewMessageSchemaType>('newMessage')
                                    .insertOne(dataNewMessageParse);
                            }
                        }
                    }

                    //cập nhật số lượng tin nhắn trong ngày
                    const reply_account_id = chatRoom?.accountId;
                    const isOaSend = data.event_name.startsWith('oa_call');
                    if (isOaSend && reply_account_id && reply_account_id !== -1) {
                        updateMessageAmountInDay(reply_account_id, 1);
                    }
                } else {
                    const app_id = data.app_id;
                    const oa_id = determineOaId(data);
                    const sender_id_of_user = determineSenderIdOfUser(data);
                    if (!sender_id_of_user) return;
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
                            const getAccountReceiveMessage = await GetAccountReceiveMessage(
                                zaloApp.accountId,
                                zaloOa.id
                            );
                            if (getAccountReceiveMessage?.accountIdReceiveMessage) {
                                chatSessionAdmin.selectedAccountId = getAccountReceiveMessage.accountIdReceiveMessage;
                            }
                            chatRoom = await createChatRoom(zaloOa, data, chatSessionAdmin);
                        } else {
                            const getAccountReceiveMessage = await GetAccountReceiveMessage(
                                zaloApp.accountId,
                                zaloOa.id
                            );
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

                    // create callPermit
                    handleCreateCallPermit(sender_id_of_user, zaloApp.appId, zaloOa.oaId, chatRoom.accountId);

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
                            const kq = await dbMonggo
                                .collection<MessageSchemaType>('message')
                                .bulkWrite(ops, { ordered: false });
                            // console.log(33333333, kq);
                            if (kq) {
                                // if (!sender_id_of_user) return;
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
                                            const allChatRoomRoles = await GetAllChatRoomRolesWithChatRoomId(
                                                chatRoom.id
                                            );
                                            if (allChatRoomRoles) {
                                                const socketMsg: SocketMessageField = {
                                                    chatRoomId: doc.chat_room_id,
                                                    _id: kq_message.insertedId.toString(),
                                                    allChatRoomRoles: allChatRoomRoles,
                                                };

                                                sendStringMessage(
                                                    `store_msg_success_${prefix}`,
                                                    JSON.stringify(socketMsg)
                                                );
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
                            const kq_message = await dbMonggo
                                .collection<MessageSchemaType>('message')
                                .insertOne(dataParse);

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

                                sendStringMessage(`store_msg_success_${prefix}`, JSON.stringify(socketMsg));
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
                                    await dbMonggo
                                        .collection<NewMessageSchemaType>('newMessage')
                                        .insertOne(dataNewMessageParse);
                                }
                            }
                        }

                        //cập nhật số lượng tin nhắn trong ngày
                        const isOaSend = data.event_name.startsWith('oa_send');
                        if (isOaSend && reply_account_id && reply_account_id !== -1) {
                            updateMessageAmountInDay(reply_account_id, 1);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
}

async function is_Pass_App_Oa(app_id: string, oa_id: string): Promise<Is_Pass_Field> {
    const check_zalo_app_with_app_id_body: Check_Zalo_App_With_App_Id_Body_Field = {
        app_id: app_id,
    };
    const zalo_app = await checkZaloApp(checkZaloAppWithAppIdBody);
    if (!zalo_app) return { isPass: false, zaloApp: null, zaloOa: null };

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

async function check_Zalo_App(
    check_zalo_app_with_app_id_body: Check_Zalo_App_With_App_Id_Body_Field
): Promise<Zalo_App_Field | undefined> {
    const app_id = check_zalo_app_with_app_id_body.app_id;
    const key_redis = `${prefix_cache__zalo_app_with_app_id}_${app_id}`;
    const zalo_app = await serviceRedis.getData<Zalo_App_Field>(key_redis);

    if (zalo_app) {
        return zalo_app;
    }

    const queryDB = new QueryDB_Check_Zalo_App_With_App_Id();
    queryDB.set_Check_Zalo_App_With_App_Id_Body(check_zalo_app_with_app_id_body);

    try {
        const result = await queryDB.run();
        if (result) {
            const zalo_app_1: Zalo_App_Field = { ...result };

            const is_set = await serviceRedis.setData<Zalo_App_Field>(key_redis, zalo_app_1, time_expireat);
            if (!is_set) {
                console.error('Failed to set zaloApp in cookie in Redis');
                return;
            }

            return zalo_app_1;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function check_Zalo_Oa(
    check_zalo_oa_list_with_zalo_app_id_body: Check_Zalo_Oa_List_With_Zalo_App_Id_Body_Field
): Promise<Zalo_Oa_Field[] | undefined> {
    const zalo_app_id = check_zalo_oa_list_with_zalo_app_id_body.zalo_app_id;
    const key_redis = `${prefix_cache__zalo_oa_list_with_zalo_app_id}_${zalo_app_id}`;
    const zalo_oa_list = await serviceRedis.getData<Zalo_Oa_Field[]>(key_redis);

    if (zalo_oa_list) {
        return zalo_oa_list;
    }

    const queryDB = new QueryDB_Check_Zalo_Oa_List_With_Zalo_App_Id();
    queryDB.set_Check_Zalo_Oa_List_With_Zalo_App_Id_Body(check_zalo_oa_list_with_zalo_app_id_body);

    try {
        const result = await queryDB.run();
        if (result) {
            const zalo_oa_list: Zalo_Oa_Field[] = result;

            const is_set = await serviceRedis.setData<Zalo_Oa_Field[]>(key_redis, zalo_oa_list, time_expireat);
            if (!is_set) {
                console.error('Failed to set zaloApp in cookie in Redis');
                return;
            }

            return zalo_oa_list;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

function determine_Oa_Id(hook_data: Hook_Data_Field): string | null {
    const event_name = hook_data.event_name;
    let oa_id: string | null = null;
    const is_user_send = event_name.startsWith('user_send');
    const is_oa_send = event_name.startsWith('oa_send');

    if (is_user_send) {
        oa_id = hook_data.recipient.id;
    }

    if (is_oa_send) {
        oa_id = hook_data.sender.id;
    }

    return oa_id;
}

function determine_Sender_Id_Of_User(hook_data: Hook_Data_Field): string | null {
    const event_name = hook_data.event_name;
    let oa_id: string | null = null;
    const is_user_send = event_name.startsWith('user_send');
    const is_oa_send = event_name.startsWith('oa_send');

    if (is_user_send) {
        oa_id = hook_data.sender.id;
    }

    if (is_oa_send) {
        oa_id = hook_data.recipient.id;
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

async function createChatRoom(
    zaloOa: ZaloOaField,
    hookData: HookDataField | HookCallField,
    chatSession: ChatSessionField
) {
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
