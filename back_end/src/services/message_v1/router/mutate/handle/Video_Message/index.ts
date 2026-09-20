import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Account_Information_Field } from '@src/data_struct/account';
import { Get_My_Account_Information_Body_Field } from '@src/data_struct/account/body';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Get_Zalo_App_With_Account_Id_Body_Field, Get_Zalo_Oa_With_Id_Body_Field } from '@src/data_struct/zalo/body';
import { Agent_Field } from '@src/data_struct/agent';
import { Get_Agent_With_Agent_Account_Id_Body_Field } from '@src/data_struct/agent/body';
import { Chat_Room_Role_Field } from '@src/data_struct/chat_room';
import { Chat_Room_Role_With_Crid_Aaid_Body_Field } from '@src/data_struct/chat_room/body';
import { Message_Amount_In_Day_Field } from '@src/data_struct/message_v1';
import { Video_Message_Body_Field } from '@src/data_struct/message_v1/body';
import QueryDB_Get_My_Account_Information from '../../queryDB/Get_My_Account_Information';
import QueryDB_Get_Zalo_App_With_Account_Id from '../../queryDB/Get_Zalo_App_With_Account_Id';
import QueryDB_Get_Zalo_Oa_With_Id from '../../queryDB/Get_Zalo_Oa_With_Id';
import QueryDB_Get_Agent_With_Agent_Account_Id from '../../queryDB/Get_Agent_With_Agent_Account_Id';
import QueryDB_Get_Chat_Room_Role_With_Crid_Aaid from '../../queryDB/Get_Chat_Room_Role_With_Crid_Aaid';
import { get_Message_Amount_In_Day } from '../../queryMongo/Get_Message_Amount_In_Day';
import { verify_refresh_token } from '@src/token';
import { account_type_enum } from '@src/data_struct/account';
import { prefix_cache__zalo_app, prefix_cache__zalo_oa } from '@src/const/redisKey/zalo';
import { prefix_cache__account_information } from '@src/const/redisKey/account';
import { prefix_cache__agent } from '@src/const/redisKey/agent';
import { Cache_Get_Chat_Room_Role_With_Crid_Aaid } from '@src/const/redisKey/chat_room';
import { send_Video_Message } from '@src/messageQueue/Producer';
import { Hook_Data_Schema, Message_Video_Field } from '@src/data_struct/zalo/hook_data';
import { Zalo_Event_Name_Enum } from '@src/data_struct/zalo/hook_data/common';
import { Message_Schema_Type, Message_Zod_Schema } from '@src/schema/message';
import { get_Db_Monggo } from '@src/connect/mongo';
import dotenv from 'dotenv';
import { getRefreshToken } from '@src/device/getDevice';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';
const dev_prefix = isProduct ? '' : 'dev';

class Handle_Video_Message {
    private _serviceRedis = ServiceRedis.getInstance();
    private _cache_get_chat_room_role_with_crid_aaid = new Cache_Get_Chat_Room_Role_With_Crid_Aaid();

    constructor() {
        this._serviceRedis.init();
        this._cache_get_chat_room_role_with_crid_aaid.init();
    }

    setup = async (req: Request<any, any, Video_Message_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<any> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-setup)',
        };

        const video_message_body: Video_Message_Body_Field = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_refresh_token(refreshToken);

            if (verify_refreshToken === 'invalid') {
                my_response.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            if (verify_refreshToken === 'expired') {
                my_response.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            const { id } = verify_refreshToken;
            video_message_body.account_id = id;
            res.locals.video_message_body = video_message_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    get_My_Account_Information = async (_: Request, res: Response, next: NextFunction) => {
        const video_message_body = res.locals.video_message_body as Video_Message_Body_Field;

        const my_response: My_Response_Field<Account_Information_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-get_My_Account_Information) !',
        };

        const get_my_account_information_body: Get_My_Account_Information_Body_Field = {
            account_id: video_message_body.account_id,
        };

        const key_redis = `${prefix_cache__account_information.key.with_account_id}_${video_message_body.account_id}`;
        const time_expireat = prefix_cache__account_information.time;

        const account_information_redis = await this._serviceRedis.getData<Account_Information_Field>(key_redis);
        if (account_information_redis) {
            res.locals.account_information = account_information_redis;
            next();
            return;
        }

        const queryDB = new QueryDB_Get_My_Account_Information();
        queryDB.set_Get_My_Account_Information_Body(get_my_account_information_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const account_information = { ...result };

                const is_set = await this._serviceRedis.setData<Account_Information_Field>(
                    key_redis,
                    account_information,
                    time_expireat
                );
                if (!is_set) {
                    console.error('Failed to set get_My_Account_Information in Redis', key_redis);
                }

                res.locals.account_information = account_information;
                next();
                return;
            } else {
                my_response.message = 'Lấy thông tin account_information KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin account_information KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    is_Has_Admin = async (_: Request, res: Response, next: NextFunction) => {
        const account_information = res.locals.account_information as Account_Information_Field;

        const my_response: My_Response_Field<Account_Information_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-is_Has_Admin) !',
        };

        const admin_id = account_information.added_by_id;
        if (!admin_id) {
            my_response.message = 'Bạn chưa có admin nào';
            res.status(200).json(my_response);
            return;
        }

        res.locals.admin_id = admin_id;
        next();
        return;
    };

    get_Zalo_App = async (_: Request, res: Response, next: NextFunction) => {
        const admin_id = res.locals.admin_id as string;
        const role = account_type_enum.MEMBER;

        const my_response: My_Response_Field<Zalo_App_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-get_Zalo_App) !',
        };

        const key_redis = `${prefix_cache__zalo_app.key.with_account_id}_${admin_id}_${role}`;
        const time_expireat = prefix_cache__zalo_app.time;

        const zalo_app_redis = await this._serviceRedis.getData<Zalo_App_Field>(key_redis);
        if (zalo_app_redis) {
            res.locals.zalo_app = zalo_app_redis;
            next();
            return;
        }

        const get_zalo_app_with_account_id_body: Get_Zalo_App_With_Account_Id_Body_Field = {
            role: role,
            account_id: admin_id,
        };

        const queryDB = new QueryDB_Get_Zalo_App_With_Account_Id();
        queryDB.set_Get_Zalo_App_With_Account_Id_Body(get_zalo_app_with_account_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const is_set = await this._serviceRedis.setData<Zalo_App_Field>(key_redis, result, time_expireat);
                if (!is_set) {
                    console.error('Failed to set zaloApp in Redis', key_redis);
                }

                res.locals.zalo_app = result;
                next();
                return;
            } else {
                my_response.message = 'Lấy thông tin zaloApp KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin zaloApp KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    is_Pass_Zalo_App = async (req: Request<any, any, Video_Message_Body_Field>, res: Response, next: NextFunction) => {
        const zalo_app = res.locals.zalo_app as Zalo_App_Field;
        const video_message_body = req.body;

        const my_response: My_Response_Field<Account_Information_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-is_Pass_Zalo_App) !',
        };

        if (video_message_body.zalo_app_id === zalo_app.id) {
            next();
            return;
        }

        my_response.message = 'Bạn không có quyền trên zalo_app này!';
        res.status(200).json(my_response);
        return;
    };

    get_Zalo_Oa = async (req: Request<any, any, Video_Message_Body_Field>, res: Response, next: NextFunction) => {
        const video_message_body = req.body;
        const role = account_type_enum.MEMBER;
        const admin_id = res.locals.admin_id as string;

        const my_response: My_Response_Field<Zalo_Oa_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-get_Zalo_Oa) !',
        };

        const key_redis = `${prefix_cache__zalo_oa.key.with_id}_${video_message_body.zalo_oa_id}_${role}`;
        const time_expireat = prefix_cache__zalo_oa.time;

        const zalo_oa_redis = await this._serviceRedis.getData<Zalo_Oa_Field>(key_redis);
        if (zalo_oa_redis) {
            res.locals.zalo_oa = zalo_oa_redis;
            next();
            return;
        }

        const get_zalo_oa_with_id_body: Get_Zalo_Oa_With_Id_Body_Field = {
            id: video_message_body.zalo_oa_id,
            account_id: admin_id,
        };

        const queryDB = new QueryDB_Get_Zalo_Oa_With_Id();
        queryDB.set_Get_Zalo_Oa_With_Id_Body(get_zalo_oa_with_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const is_set = await this._serviceRedis.setData<Zalo_Oa_Field>(key_redis, result, time_expireat);
                if (!is_set) {
                    console.error('Failed to set zaloOa in Redis', key_redis);
                }

                res.locals.zalo_oa = result;
                next();
                return;
            } else {
                my_response.message = 'Lấy thông tin zaloOa KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin zaloOa KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    is_Pass_Zalo_Oa = async (req: Request<any, any, Video_Message_Body_Field>, res: Response, next: NextFunction) => {
        const zalo_oa = res.locals.zalo_oa as Zalo_Oa_Field;
        const video_message_body: Video_Message_Body_Field = req.body;

        const my_response: My_Response_Field<Account_Information_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-is_Pass_Zalo_Oa) !',
        };

        if (video_message_body.zalo_oa_id === zalo_oa.id) {
            next();
            return;
        }

        my_response.message = 'Bạn không có quyền trên zalo_oa này!';
        res.status(200).json(my_response);
        return;
    };

    get_Agent = async (_: Request, res: Response, next: NextFunction) => {
        const video_message_body = res.locals.video_message_body as Video_Message_Body_Field;

        const my_response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-get_Agent) !',
        };

        const get_agent_with_agent_account_id_body: Get_Agent_With_Agent_Account_Id_Body_Field = {
            agent_account_id: video_message_body.account_id,
        };

        const key_redis = `${prefix_cache__agent.key.with_agent_account_id}_${get_agent_with_agent_account_id_body.agent_account_id}`;
        const time_expireat = prefix_cache__agent.time;

        const agent_redis = await this._serviceRedis.getData<Agent_Field>(key_redis);
        if (agent_redis) {
            res.locals.agent = agent_redis;
            next();
            return;
        }

        const queryDB = new QueryDB_Get_Agent_With_Agent_Account_Id();
        queryDB.set_Get_Agent_With_Agent_Account_Id_Body(get_agent_with_agent_account_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const is_set = await this._serviceRedis.setData<Agent_Field>(key_redis, result, time_expireat);
                if (!is_set) {
                    console.error('Failed to set agent in Redis', key_redis);
                }

                res.locals.agent = result;
                next();
                return;
            } else {
                my_response.message = 'Lấy thông tin Agent KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin Agent KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    check_Limit_Message = async (_: Request, res: Response, next: NextFunction) => {
        const video_message_body = res.locals.video_message_body as Video_Message_Body_Field;
        const my_id = video_message_body.account_id;
        const agent = res.locals.agent as Agent_Field;
        const type = agent.type;

        const my_response: My_Response_Field<Message_Amount_In_Day_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-check_Limit_Message) !',
        };

        if (type !== 'basic') {
            next();
            return;
        }

        const data: Message_Amount_In_Day_Field | undefined = await get_Message_Amount_In_Day(my_id);
        if (!data) {
            my_response.message = 'Lấy thông tin số lượng tin nhắn không thành công !';
            next();
            return;
        }

        const message_amount = data.amount;
        if (message_amount < 30) {
            next();
            return;
        }

        my_response.message = 'Gói cơ bản của bạn đã hết hạn mức, vui lòng nâng cấp !';
        res.status(200).json(my_response);
        return;
    };

    get_Chat_Room_Role = async (_: Request, res: Response, next: NextFunction) => {
        const video_message_body = res.locals.video_message_body as Video_Message_Body_Field;

        const chat_room_role_with_crid_aaid_body: Chat_Room_Role_With_Crid_Aaid_Body_Field = {
            authorized_account_id: video_message_body.account_id,
            chat_room_id: video_message_body.chat_room_id,
        };

        const my_response: My_Response_Field<Chat_Room_Role_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-get_Chat_Room_Role)',
        };

        const chat_room_role_cache = await this._cache_get_chat_room_role_with_crid_aaid.get_Data();
        if (chat_room_role_cache) {
            res.locals.chat_room_role = chat_room_role_cache;
            next();
            return;
        }

        const queryDB = new QueryDB_Get_Chat_Room_Role_With_Crid_Aaid();
        queryDB.set_Chat_Room_Role_With_Crid_Aaid_Body(chat_room_role_with_crid_aaid_body);

        try {
            const result = await queryDB.run();
            if (result) {
                this._cache_get_chat_room_role_with_crid_aaid.set_Fk_Crid(result.chat_room_id);
                this._cache_get_chat_room_role_with_crid_aaid.set_Data(result);

                res.locals.chat_room_role = result;
                next();
                return;
            } else {
                my_response.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công 1 !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    is_Pass_Room = async (_: Request, res: Response, next: NextFunction) => {
        const chat_room_role = res.locals.chat_room_role as Chat_Room_Role_Field;

        const my_response: My_Response_Field<Chat_Room_Role_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Video_Message-is_Pass_Room)',
        };

        const is_send = chat_room_role.is_send;

        if (is_send) {
            next();
            return;
        } else {
            my_response.message = 'Bạn không có quyền này !';
            res.status(200).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const video_message_body = res.locals.video_message_body as Video_Message_Body_Field;
        const zalo_app = res.locals.zalo_app as Zalo_App_Field;
        const zalo_oa = res.locals.zalo_oa as Zalo_Oa_Field;

        const my_response: My_Response_Field<any> = {
            is_success: true,
            message: 'Bắt đầu (Handle_Video_Message-main)',
        };

        const message_video: Message_Video_Field = {
            msg_id: video_message_body.video_name,
            attachments: [
                {
                    payload: {
                        thumbnail: '',
                        description: '',
                        url: '',
                    },
                    type: 'video',
                },
            ],
        };

        const hook_data_schema: Hook_Data_Schema<Message_Video_Field> = {
            event_name: Zalo_Event_Name_Enum.oa_send_video,
            app_id: zalo_app.app_id,
            oa_id: zalo_oa.oa_id,
            chat_room_id: video_message_body.chat_room_id,
            user_id_by_app: video_message_body.user_id_by_app,
            sender_id: video_message_body.oa_id,
            recipient_id: video_message_body.user_id,
            reply_account_id: video_message_body.account_id,
            message_id: video_message_body.video_name,
            message: message_video,
            is_seen: false,
            timestamp: new Date(),
        };

        const parsed_message = Message_Zod_Schema.safeParse(hook_data_schema);
        if (!parsed_message.success) {
            console.error('Invalid message format:', parsed_message.error);
            my_response.message = parsed_message.error.toString();

            res.status(200).json(my_response);
            return;
        } else {
            try {
                const db_monggo = get_Db_Monggo();
                const data_parse = parsed_message.data;
                await db_monggo.collection<Message_Schema_Type>('wait_video_message').insertOne(data_parse);
            } catch (error) {
                console.error('Error inserting message to MongoDB:', error);
                my_response.message = 'Thực hiện gửi thước phim không thành công !';
                my_response.err = error;
                res.status(200).json(my_response);
                return;
            }
        }

        send_Video_Message(`sendVideoMessage_${dev_prefix}`, video_message_body);

        my_response.message = 'Bạn vừa gửi video !';
        res.status(200).json(my_response);
        return;
    };
}

export default Handle_Video_Message;
