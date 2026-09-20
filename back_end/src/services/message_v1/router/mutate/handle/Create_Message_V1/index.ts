import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { verify_Refresh_Token } from '@src/token';
import { send_Message_To_User } from '@src/services/message_v1/send_Message_To_User';
import { Agent_Field } from '@src/data_struct/agent';
import { Get_Agent_With_Agent_Account_Id_Body_Field } from '@src/data_struct/agent/body';
import { Message_Amount_In_Day_Field } from '@src/data_struct/message_v1';
import { Create_Message_V1_Body_Field } from '@src/data_struct/message_v1/body';
import { Zalo_Oa_Field, Zalo_App_Field } from '@src/data_struct/zalo';
import { Get_Zalo_App_With_Account_Id_Body_Field, Get_Zalo_Oa_With_Id_Body_Field } from '@src/data_struct/zalo/body';
import { Result_Send_To_Zalo_Field } from '@src/data_struct/zalo/hook_data';
import { account_type_enum } from '@src/data_struct/account';
import { prefix_cache__zalo_app, prefix_cache__zalo_oa } from '@src/const/redisKey/zalo';
import { prefix_cache__agent } from '@src/const/redisKey/agent';
import QueryDB_Get_Zalo_App_With_Account_Id from '../../queryDB/Get_Zalo_App_With_Account_Id';
import QueryDB_Get_Zalo_Oa_With_Id from '../../queryDB/Get_Zalo_Oa_With_Id';
import QueryDB_Get_Agent_With_Agent_Account_Id from '../../queryDB/Get_Agent_With_Agent_Account_Id';
import { get_Message_Amount_In_Day } from '../../queryMongo/Get_Message_Amount_In_Day';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Message_V1 {
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    setup = (req: Request<any, any, any>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Result_Send_To_Zalo_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Message_V1-setup)',
        };

        // const { refreshToken } = req.cookies;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_Refresh_Token(refreshToken);

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

            res.locals.my_id = id;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    get_Zalo_App = async (req: Request<any, any, Create_Message_V1_Body_Field>, res: Response, next: NextFunction) => {
        const create_message_v1_body = req.body;
        const zalo_app = create_message_v1_body.zalo_app;
        const account_id = zalo_app.account_id;
        const role = account_type_enum.ADMIN;

        const my_response: My_Response_Field<Zalo_App_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Message_V1-get_Zalo_App) !',
        };

        const key_redis = `${prefix_cache__zalo_app.key.with_account_id}_${account_id}_${role}`;
        const time_expireat = prefix_cache__zalo_app.time;

        const zalo_app_redis = await this._serviceRedis.getData<Zalo_App_Field>(key_redis);
        if (zalo_app_redis) {
            res.locals.zalo_app = zalo_app_redis;
            next();
            return;
        }

        const get_zalo_app_with_account_id_body: Get_Zalo_App_With_Account_Id_Body_Field = {
            role: role,
            account_id: zalo_app.account_id,
        };

        const queryDB = new QueryDB_Get_Zalo_App_With_Account_Id();
        queryDB.set_Get_Zalo_App_With_Account_Id_Body(get_zalo_app_with_account_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const zalo_app = { ...result };

                const is_set = await this._serviceRedis.setData<Zalo_App_Field>(key_redis, zalo_app, time_expireat);
                if (!is_set) {
                    console.error('Failed to set zalo_app in Redis', key_redis);
                }

                res.locals.zalo_app = zalo_app;
                next();
                return;
            } else {
                my_response.message = 'Lấy thông tin zalo_app KHÔNG thành công 1 !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin zalo_app KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    get_Zalo_Oa = async (req: Request<any, any, Create_Message_V1_Body_Field>, res: Response, next: NextFunction) => {
        const create_message_v1_body = req.body;
        const zalo_oa = create_message_v1_body.zalo_oa;
        const id = zalo_oa.id;
        const role = account_type_enum.ADMIN;

        const my_response: My_Response_Field<Zalo_Oa_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Message_V1-get_Zalo_Oa) !',
        };

        const key_redis = `${prefix_cache__zalo_oa.key.with_id}_${id}_${role}`;
        const time_expireat = prefix_cache__zalo_oa.time;

        const zalo_oa_redis = await this._serviceRedis.getData<Zalo_Oa_Field>(key_redis);
        if (zalo_oa_redis) {
            res.locals.zalo_oa = zalo_oa_redis;
            next();
            return;
        }

        const get_zalo_oa_with_id_body: Get_Zalo_Oa_With_Id_Body_Field = {
            id: id,
            account_id: zalo_oa.account_id,
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
                my_response.message = 'Lấy thông tin zaloOa KHÔNG thành công 1 !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin zaloOa KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    get_Agent = async (_: Request, res: Response, next: NextFunction) => {
        const my_id = res.locals.my_id as string;

        const my_response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Message_V1-get_Agent) !',
        };

        const get_agent_with_agent_account_id_body: Get_Agent_With_Agent_Account_Id_Body_Field = {
            agent_account_id: my_id,
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
                const isSet = await this._serviceRedis.setData<Agent_Field>(key_redis, result, time_expireat);
                if (!isSet) {
                    console.error('Failed to set agent in Redis', key_redis);
                }

                res.locals.agent = result;
                next();
                return;
            } else {
                my_response.message = 'Lấy thông tin Agent KHÔNG thành công 1 !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin Agent KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    check_Limit_Message = async (_: Request, res: Response, next: NextFunction) => {
        const my_id = res.locals.my_id as string;
        const agent = res.locals.agent as Agent_Field;
        const type = agent.type;

        const my_response: My_Response_Field<Message_Amount_In_Day_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Message_V1-check_Limit_Message) !',
        };

        if (type !== 'basic') {
            next();
            return;
        }

        const data: Message_Amount_In_Day_Field | undefined = await get_Message_Amount_In_Day(my_id);
        if (!data) {
            my_response.message = 'Lấy thông tin số lượng tin nhắn không thành công !';
            // res.status(200).json(myResponse);
            next();
            return;
        }

        const message_amount = data.amount;
        if (message_amount < 150) {
            next();
            return;
        }

        my_response.message = 'Gói cơ bản của bạn đã hết hạn mức, vui lòng nâng cấp !';
        res.status(200).json(my_response);
        return;
    };

    main = async (req: Request<any, any, Create_Message_V1_Body_Field>, res: Response) => {
        const create_message_v1_body = req.body;
        const zalo_app = res.locals.zalo_app as Zalo_App_Field;
        const zalo_oa = res.locals.zalo_oa as Zalo_Oa_Field;
        const payload = create_message_v1_body.payload;
        const my_id = res.locals.my_id as string;

        const my_response: My_Response_Field<Result_Send_To_Zalo_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Message_V1-main)',
        };

        const result = await send_Message_To_User(zalo_app, zalo_oa, payload);

        if (result?.message === 'Success') {
            const key_redis = `replyAccountId_with_message_id_${result.data.message_id}`;
            const time_expireat = 30;
            const is_set = await this._serviceRedis.setData<string>(key_redis, my_id, time_expireat);
            if (!is_set) {
                console.error('Failed to set replyAccountId_with_message_id in Redis', key_redis);
            }
            my_response.data = result;
            my_response.message = 'Gửi tin thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        } else {
            my_response.message = 'Gửi tin không thành công !';
            res.status(200).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Message_V1;
