import { consume_Hook_Data } from '@src/messageQueue/Consumer';
import { send_String_Message } from '@src/messageQueue/Producer';
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
import ServiceRedis from '@src/cache/cacheRedis';
import { Get_Account_Receive_Message_Body_Field } from '@src/data_struct/account/body';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Chat_Room_Field, Chat_Room_Role_Schema } from '@src/data_struct/chat_room';
import { User_Take_Room_To_Chat_Body_Field, Chat_Room_Body_Field } from '@src/data_struct/chat_room/body';
import {
    Check_Zalo_App_With_App_Id_Body_Field,
    Check_Zalo_Oa_List_With_Zalo_App_Id_Body_Field,
} from '@src/data_struct/zalo/body';
import QueryDB_Check_Zalo_App_With_App_Id from './handle_Hook_Data/queryDB/Check_Zalo_App_With_App_Id';
import QueryDB_Check_Zalo_Oa_List_With_Zalo_App_Id from './handle_Hook_Data/queryDB/Check_Zalo_Oa_List_With_Zalo_App_Id';
import QueryDB_User_Take_Room_To_Chat from './handle_Hook_Data/queryDB/User_Take_Room_To_Chat';
import QueryDB_Get_Account_Receive_Message from './handle_Hook_Data/queryDB/Get_Account_Receive_Message';
import QueryDB_Get_All_Chat_Room_Roles_With_Chat_Room_Id from './handle_Hook_Data/queryDB/Get_All_Chat_Room_Roles_With_Chat_Room_Id';
import MutateDB_Create_Chat_Room from './handle_Hook_Data/mutateDB/Create_Chat_Room';
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
import { feedback_To_Take_Chat_Session } from './handle_Hook_Data/feedback_To_Take_Chat_Session';
import { Chat_Session_Field } from '@src/data_struct/chat_session';
import { send_Message_To_User } from './send_Message_To_User';
import { ensure_Indexes } from './handle_Hook_Data/ensure_Indexes';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';
import { Zalo_Event_Name_Enum } from '@src/data_struct/zalo/hook_data/common';
import handle_Create_Call_Permit from './handle_Create_Call_Permit';
import { hook_Call_Get_Chat_Room, hook_Call_Feedback_To_Take_Chat_Session } from './handle_Hook_Call';

const prefix = getEnv() === myEnv.Dev ? 'dev' : '';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

ensure_Indexes();

const time_expireat = 60 * 3; // 3p

export function hook_Data() {
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

                    const { is_pass, zalo_app, zalo_oa } = await is_Pass_App_Oa(app_id, oa_id);
                    if (!is_pass) return;
                    if (!zalo_app) return;
                    if (!zalo_oa) return;

                    chat_room = await hook_Call_Get_Chat_Room(data, zalo_oa);

                    if (!chat_room) {
                        hook_Call_Feedback_To_Take_Chat_Session(zalo_app, zalo_oa, data);
                        return;
                    }

                    const hook_call_schema: Hook_Call_Schema = {
                        event_name: data.event_name,
                        app_id: data.app_id,
                        oa_id: oa_id,
                        chat_room_id: chat_room?.id || '',
                        user_id_by_app: data.user_id_by_app,
                        user_id: data.user_id,
                        call_id: data.call_id,
                        call_type: data.call_type,
                        waiting_time: data.waiting_time,
                        init_time: data.init_time,
                        call_duration: data.call_duration,
                        talk_time: data.talk_time,
                        status_code: data.status_code,
                        reply_account_id: chat_room?.account_id || '',
                        is_seen: false,
                        timestamp: parse_Timestamp(data.timestamp),
                    };

                    const parsed_call = Call_Zod_Schema.safeParse(hook_call_schema);

                    if (!parsed_call.success) {
                        console.error('Invalid call format:', parsed_call.error);
                    } else {
                        const db_monggo = get_Db_Monggo();
                        const data_parse = parsed_call.data;
                        const kq_message = await db_monggo
                            .collection<Message_Schema_Type>('message')
                            .insertOne(data_parse);

                        const { _id, ...doc } = data_parse as any;

                        await db_monggo
                            .collection<Message_Schema_Type>('last_message')
                            .updateOne({ chat_room_id: doc.chat_room_id }, { $set: doc }, { upsert: true });

                        // phuc vu realtime
                        const all_chat_room_roles = await get_All_Chat_Room_Roles_With_Chat_Room_Id(chat_room.id);
                        if (all_chat_room_roles) {
                            const socket_msg: Socket_Message_Field = {
                                chat_room_id: doc.chat_room_id,
                                _id: kq_message.insertedId.toString(),
                                all_chat_room_roles: all_chat_room_roles,
                            };

                            send_String_Message(`store_msg_success_${prefix}`, JSON.stringify(socket_msg));
                        }
                    }

                    // thiết lập newMessage để xem tin nhắn mới chưa xem
                    const all_chat_room_roles = await get_All_Chat_Room_Roles_With_Chat_Room_Id(chat_room.id);
                    if (all_chat_room_roles) {
                        for (let i: number = 0; i < all_chat_room_roles.length; i++) {
                            const newCall: New_Call_V1_Field<Zalo_Call_Type> = {
                                ...hook_call_schema,
                                account_id: all_chat_room_roles[i].authorized_account_id,
                                created_at: new Date(),
                            };

                            const parsed_new_message = New_Message_Zod_Schema.safeParse(newCall);

                            if (!parsed_new_message.success) {
                                console.error('Invalid message format:', parsed_new_message.error);
                            } else {
                                const db_monggo = get_Db_Monggo();
                                const data_new_message_parse = parsed_new_message.data;
                                await db_monggo
                                    .collection<New_Message_Schema_Type>('new_message')
                                    .insertOne(data_new_message_parse);
                            }
                        }
                    }

                    //cập nhật số lượng tin nhắn trong ngày
                    const reply_account_id = chat_room?.account_id;
                    const is_oa_send = data.event_name.startsWith('oa_call');
                    if (is_oa_send && reply_account_id && reply_account_id.length > 0) {
                        update_Message_Amount_In_Day(reply_account_id, 1);
                    }
                } else {
                    const app_id = data.app_id;
                    const oa_id = determine_Oa_Id(data);
                    const sender_id_of_user = determine_Sender_Id_Of_User(data);
                    if (!sender_id_of_user) return;
                    let chat_room: Chat_Room_Field | undefined = undefined;

                    if (!oa_id) return;

                    const { is_pass, zalo_app, zalo_oa } = await is_Pass_App_Oa(app_id, oa_id);

                    if (!is_pass) return;
                    if (!zalo_app) return;
                    if (!zalo_oa) return;

                    // get chat room
                    chat_room = await get_Chat_Room(data, zalo_oa);
                    // console.log(1111, chatRoom);
                    let is_feedback: boolean = false;
                    let wait_session: Wait_Session_Field | undefined = undefined;

                    if (!chat_room) {
                        // feedback to take session-code
                        wait_session = await feedback_To_Take_Chat_Session(zalo_app, zalo_oa, data);
                        is_feedback = true;

                        if (!wait_session) {
                            return;
                        }
                        // console.dir(waitSession, { depth: null });
                        const chat_session = wait_session.chat_session;
                        if (!chat_session) {
                            // get default chat session
                            const chat_session_admin: Chat_Session_Field = {
                                id: '',
                                label: '',
                                code: '',
                                is_ready: true,
                                status: '',
                                selected_account_id: zalo_app.account_id,
                                zalo_oa_id: '',
                                account_id: '',
                                update_time: '',
                                create_time: '',
                            };
                            const get_account_receive_message = await get_Account_Receive_Message(
                                zalo_app.account_id,
                                zalo_oa.id
                            );
                            if (get_account_receive_message?.account_id_receive_message) {
                                chat_session_admin.selected_account_id =
                                    get_account_receive_message.account_id_receive_message;
                            }
                            chat_room = await create_Chat_Room(zalo_oa, data, chat_session_admin);
                        } else {
                            const get_account_receive_message = await get_Account_Receive_Message(
                                zalo_app.account_id,
                                zalo_oa.id
                            );
                            if (get_account_receive_message?.account_id_receive_message) {
                                chat_session.selected_account_id =
                                    get_account_receive_message.account_id_receive_message;
                            }
                            chat_room = await create_Chat_Room(zalo_oa, data, chat_session);
                        }

                        if (chat_room) {
                            create_Chat_Room_Role_Mongo(chat_room, zalo_oa);
                        }
                    }

                    // console.log(1111, chatRoom);
                    if (!chat_room) return;

                    // create callPermit
                    handle_Create_Call_Permit(sender_id_of_user, zalo_app.app_id, zalo_oa.oa_id, chat_room.account_id);

                    if (is_feedback && wait_session) {
                        // store message then feedback
                        const hook_datas = wait_session.hook_datas;
                        const hook_data_schemas: Hook_Data_Schema[] = [];
                        for (let i: number = 0; i < hook_datas.length; i++) {
                            const hook_data_schema: Hook_Data_Schema = {
                                event_name: hook_datas[i].event_name,
                                app_id: hook_datas[i].app_id,
                                oa_id: oa_id,
                                chat_room_id: chat_room?.id || '',
                                user_id_by_app: hook_datas[i].user_id_by_app,
                                sender_id: hook_datas[i].sender.id,
                                recipient_id: hook_datas[i].recipient.id,
                                reply_account_id: chat_room?.account_id || '',
                                message_id: hook_datas[i].message.msg_id,
                                message: hook_datas[i].message,
                                is_seen: false,
                                timestamp: parse_Timestamp(hook_datas[i].timestamp),
                            };
                            hook_data_schemas.push(hook_data_schema);
                        }

                        const hook_datas_message = Message_Zod_Schema.array().safeParse(hook_data_schemas);

                        if (!hook_datas_message.success) {
                            console.error('Invalid message format:', hook_datas_message.error);
                        } else {
                            const ops = hook_datas_message.data.map((doc) => ({
                                insertOne: { document: doc },
                            }));
                            const db_monggo = get_Db_Monggo();
                            const kq = await db_monggo
                                .collection<Message_Schema_Type>('message')
                                .bulkWrite(ops, { ordered: false });
                            // console.log(33333333, kq);
                            if (kq) {
                                // if (!sender_id_of_user) return;
                                send_Message_To_User(zalo_app, zalo_oa, {
                                    recipient: { user_id: sender_id_of_user },
                                    message: {
                                        text: 'Bây giờ bạn có thể bắt đầu cuộc hội thoại !',
                                    },
                                });
                            }
                        }
                    } else {
                        const key_redis = `replyAccountId_with_message_id_${data.message.msg_id}`;

                        let reply_account_id: string | null = null;
                        reply_account_id = await serviceRedis.getData<string>(key_redis);

                        if (!reply_account_id) {
                            reply_account_id = ''; // phai dung truoc khi xu ly tin nhan, de tranh tinh trang bi thieu reply_account_id khi gui tin nhan video
                            // dùng khi gửi tin nhắn video
                            if (data.event_name === Zalo_Event_Name_Enum.oa_send_text) {
                                const data1 = data as Hook_Data_Field<Message_Text_Field>;
                                const message_text = data1.message.text;
                                const [ma_part, url_part] = message_text.split(',duongdan:');
                                const file_name = ma_part.replace('ma:', '');
                                const parts = file_name.split('-');
                                const account_id = parts[1];
                                const url = url_part;

                                reply_account_id = account_id;

                                const hook_data_schema__send_video = await get_Wait_Video_Message(reply_account_id);
                                if (hook_data_schema__send_video && data1.message.quote_msg_id) {
                                    hook_data_schema__send_video.message_id = data1.message.quote_msg_id;
                                    hook_data_schema__send_video.message.msg_id = data1.message.quote_msg_id;
                                    hook_data_schema__send_video.message.attachments[0].payload.url = url;

                                    const parsed_message = Message_Zod_Schema.safeParse(hook_data_schema__send_video);
                                    if (!parsed_message.success) {
                                        console.error('Invalid message format:', parsed_message.error);
                                    } else {
                                        try {
                                            const db_monggo = get_Db_Monggo();
                                            const data_parse = parsed_message.data;
                                            const kq_message = await db_monggo
                                                .collection<Message_Schema_Type>('message')
                                                .insertOne(data_parse);

                                            const { _id, ...doc } = data_parse as any;

                                            // phuc vu realtime
                                            const all_chat_room_roles = await get_All_Chat_Room_Roles_With_Chat_Room_Id(
                                                chat_room.id
                                            );
                                            if (all_chat_room_roles) {
                                                const socket_msg: Socket_Message_Field = {
                                                    chat_room_id: doc.chat_room_id,
                                                    _id: kq_message.insertedId.toString(),
                                                    all_chat_room_roles: all_chat_room_roles,
                                                };

                                                send_String_Message(
                                                    `store_msg_success_${prefix}`,
                                                    JSON.stringify(socket_msg)
                                                );
                                            }
                                        } catch (error) {
                                            console.error('Error inserting message to MongoDB:', error);
                                        }
                                    }
                                }
                            }
                        }

                        const hook_data_schema: Hook_Data_Schema = {
                            event_name: data.event_name,
                            app_id: data.app_id,
                            oa_id: oa_id,
                            chat_room_id: chat_room?.id || '',
                            user_id_by_app: data.user_id_by_app,
                            sender_id: data.sender.id,
                            recipient_id: data.recipient.id,
                            reply_account_id: reply_account_id,
                            message_id: data.message.msg_id,
                            message: data.message,
                            is_seen: false,
                            timestamp: parse_Timestamp(data.timestamp),
                        };

                        const parsed_message = Message_Zod_Schema.safeParse(hook_data_schema);

                        if (!parsed_message.success) {
                            console.error('Invalid message format:', parsed_message.error);
                        } else {
                            const db_monggo = get_Db_Monggo();
                            const data_parse = parsed_message.data;
                            const kq_message = await db_monggo
                                .collection<Message_Schema_Type>('message')
                                .insertOne(data_parse);

                            const { _id, ...doc } = data_parse as any;

                            await db_monggo
                                .collection<Message_Schema_Type>('last_message')
                                .updateOne({ chat_room_id: doc.chat_room_id }, { $set: doc }, { upsert: true });

                            // phuc vu realtime
                            const all_chat_room_roles = await get_All_Chat_Room_Roles_With_Chat_Room_Id(chat_room.id);
                            if (all_chat_room_roles) {
                                const socket_msg: Socket_Message_Field = {
                                    chat_room_id: doc.chat_room_id,
                                    _id: kq_message.insertedId.toString(),
                                    all_chat_room_roles: all_chat_room_roles,
                                };

                                send_String_Message(`store_msg_success_${prefix}`, JSON.stringify(socket_msg));
                            }
                        }

                        // thiết lập newMessage để xem tin nhắn mới chưa xem
                        const all_chat_room_roles = await get_All_Chat_Room_Roles_With_Chat_Room_Id(chat_room.id);
                        if (all_chat_room_roles) {
                            for (let i: number = 0; i < all_chat_room_roles.length; i++) {
                                const new_message: New_Message_V1_Field<Zalo_Message_Type> = {
                                    ...hook_data_schema,
                                    account_id: all_chat_room_roles[i].authorized_account_id,
                                    created_at: new Date(),
                                };

                                const parsed_new_message = New_Message_Zod_Schema.safeParse(new_message);

                                if (!parsed_new_message.success) {
                                    console.error('Invalid message format:', parsed_new_message.error);
                                } else {
                                    const db_monggo = get_Db_Monggo();
                                    const data_new_message_parse = parsed_new_message.data;
                                    await db_monggo
                                        .collection<New_Message_Schema_Type>('new_message')
                                        .insertOne(data_new_message_parse);
                                }
                            }
                        }

                        //cập nhật số lượng tin nhắn trong ngày
                        const is_oa_send = data.event_name.startsWith('oa_send');
                        if (is_oa_send && reply_account_id && reply_account_id.length > 0) {
                            update_Message_Amount_In_Day(reply_account_id, 1);
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
    const zalo_app = await check_Zalo_App(check_zalo_app_with_app_id_body);
    if (!zalo_app) return { is_pass: false, zalo_app: null, zalo_oa: null };

    const check_zalo_oa_list_with_zalo_app_id_body: Check_Zalo_Oa_List_With_Zalo_App_Id_Body_Field = {
        zalo_app_id: zalo_app.id,
    };
    const zalo_oa_list = await check_Zalo_Oa(check_zalo_oa_list_with_zalo_app_id_body);
    if (!zalo_oa_list) return { is_pass: false, zalo_app: zalo_app, zalo_oa: null };
    let exist_oa: boolean = false;
    let oa_in_index: number = -1;
    for (let i: number = 0; i < zalo_oa_list.length; i++) {
        if (oa_id === zalo_oa_list[i].oa_id) {
            exist_oa = true;
            oa_in_index = i;
            break;
        }
    }

    if (exist_oa) {
        return { is_pass: true, zalo_app: zalo_app, zalo_oa: zalo_oa_list[oa_in_index] };
    }
    return { is_pass: false, zalo_app: zalo_app, zalo_oa: null };
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

async function get_Chat_Room(hook_data: Hook_Data_Field, zalo_oa: Zalo_Oa_Field): Promise<Chat_Room_Field | undefined> {
    const user_id_by_app = hook_data.user_id_by_app;
    const zalo_oa_id = zalo_oa.id;
    const user_take_room_to_chat_body: User_Take_Room_To_Chat_Body_Field = {
        user_id_by_app: user_id_by_app,
        zalo_oa_id: zalo_oa_id,
    };

    const cache_get_chat_room_with_zalo_oa_id_user_id_by_app = new Cache_Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App();
    await cache_get_chat_room_with_zalo_oa_id_user_id_by_app.init();
    cache_get_chat_room_with_zalo_oa_id_user_id_by_app.set_Body({
        zalo_oa_id: zalo_oa_id,
        user_id_by_app: user_id_by_app,
    });

    const chat_room_cache = await cache_get_chat_room_with_zalo_oa_id_user_id_by_app.get_Data();

    if (chat_room_cache) {
        return chat_room_cache;
    }

    const queryDB = new QueryDB_User_Take_Room_To_Chat();
    queryDB.set_User_Take_Room_To_Chat_Body(user_take_room_to_chat_body);

    try {
        const result = await queryDB.run();
        if (result) {
            cache_get_chat_room_with_zalo_oa_id_user_id_by_app.set_Data(result);

            return result;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function create_Chat_Room(
    zalo_oa: Zalo_Oa_Field,
    hook_data: Hook_Data_Field | Hook_Call_Field,
    chat_session: Chat_Session_Field
) {
    const chat_room_body: Chat_Room_Body_Field = {
        user_id_by_app: hook_data.user_id_by_app,
        zalo_oa_id: zalo_oa.id,
        account_id: chat_session.selected_account_id,
    };

    const queryDB = new MutateDB_Create_Chat_Room();
    queryDB.set_Chat_Room_Body(chat_room_body);

    try {
        const result = await queryDB.run();
        if (result) {
            return result;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function create_Chat_Room_Role_Mongo(chat_room: Chat_Room_Field, zalo_oa: Zalo_Oa_Field) {
    const chat_room_role_schema: Chat_Room_Role_Schema = {
        authorized_account_id: chat_room.account_id,
        is_read: true,
        is_send: true,
        chat_room_id: chat_room.id,
        zalo_oa_id: zalo_oa.id,
        account_id: chat_room.account_id,
    };
    const parsed_chat_room_role = Chat_Room_Role_Zod_Schema.safeParse(chat_room_role_schema);
    if (!parsed_chat_room_role.success) {
        console.error('Invalid chatRoomRole format:', parsed_chat_room_role.error);
    } else {
        const db_monggo = get_Db_Monggo();
        const data_parse = parsed_chat_room_role.data;
        await db_monggo.collection<Chat_Room_Role_Schema_Type>('chat_room_role').insertOne(data_parse);
    }
}

async function get_Account_Receive_Message(selected_account_id: string, zalo_oa_id: string) {
    const get_account_receive_message_body: Get_Account_Receive_Message_Body_Field = {
        zalo_oa_id: zalo_oa_id,
        account_id: selected_account_id,
    };

    const queryDB = new QueryDB_Get_Account_Receive_Message();
    queryDB.set_Get_Account_Receive_Message_Body(get_account_receive_message_body);

    try {
        const result = await queryDB.run();
        if (result) {
            return result;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function get_All_Chat_Room_Roles_With_Chat_Room_Id(chat_room_id: string) {
    const cache_get_all_chat_room_role_with_crid = new Cache_Get_All_Chat_Room_Role_With_Crid();
    await cache_get_all_chat_room_role_with_crid.init();

    cache_get_all_chat_room_role_with_crid.set_Body({ chat_room_id: chat_room_id });
    const all_chat_room_role_cache = await cache_get_all_chat_room_role_with_crid.get_Data();

    if (all_chat_room_role_cache) {
        return all_chat_room_role_cache;
    }

    const queryDB = new QueryDB_Get_All_Chat_Room_Roles_With_Chat_Room_Id();
    queryDB.set_Chat_Room_Id(chat_room_id);

    try {
        const result = await queryDB.run();
        if (result) {
            cache_get_all_chat_room_role_with_crid.set_Data(result);

            return result;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

function parse_Timestamp(ts: string) {
    const n = Number(ts);

    if (!Number.isNaN(n)) {
        if (ts.length === 10) return new Date(n * 1000);
        if (ts.length === 13) return new Date(n);
    }

    return new Date(ts); // ISO string
}

async function update_Message_Amount_In_Day(account_id: string, amount: number) {
    const now = new Date();
    const date_key = get_Date_Key_VN(now);

    const db = get_Db_Monggo();
    const col = db.collection<Message_Amount_In_Day_Type>('message_amount_in_day');

    const existing = await col.findOne<Message_Amount_In_Day_Field>({
        account_id: account_id,
        date_key: date_key,
    });

    if (existing) {
        const old_amount = existing.amount;
        await col.updateOne({ account_id: account_id, date_key: date_key }, { $set: { amount: old_amount + 1 } });
    } else {
        const new_message_amount_in_day: Message_Amount_In_Day_Field = {
            account_id: account_id,
            date_key: date_key,
            timestamp: now,
            amount: amount,
        };
        const parsed = Message_Amount_In_Day_Schema.safeParse(new_message_amount_in_day);

        if (!parsed.success) {
            console.error('Invalid new_message_amount_in_day format:', parsed.error);
        } else {
            await col.insertOne(parsed.data);
        }
    }
}

async function get_Wait_Video_Message(
    reply_account_id: string
): Promise<Message_V1_Field<Message_Video_Field> | undefined> {
    // const db = getDbMonggo();
    // const col = db.collection<MessageV1Field<MessageVideoField>>('waitVideoMessage');

    // const data = await col
    //     .find<MessageV1Field<MessageVideoField>>({ reply_account_id }, { projection: { _id: 0 } })
    //     .sort({ timestamp: -1 })
    //     .limit(1)
    //     .toArray();

    // return data.length > 0 ? data[0] : undefined;
    const db = get_Db_Monggo();
    const col = db.collection<Message_V1_Field<Message_Video_Field>>('wait_video_message');

    const result = await col.findOneAndDelete(
        { reply_account_id },
        {
            sort: { timestamp: -1 }, // lấy mới nhất
            projection: { _id: 0 },
        }
    );

    return result ?? undefined;
}
