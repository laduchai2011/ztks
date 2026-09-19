import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Zalo_App_Field } from '@src/data_struct/zalo';
import { Get_Zalo_App_With_Account_Id_Body_Field } from '@src/data_struct/zalo/body';
import { Zalo_User_Field } from '@src/data_struct/zalo/user';
import QueryDB_Get_Zalo_User_Infor from '../../queryZalo/Get_Zalo_User_Infor';
import { Get_Zalo_User_Body_Field } from '@src/data_struct/zalo/user/body';
import { prefix_cache__zalo_user } from '@src/const/redisKey/zalo';
import { account_type_enum } from '@src/data_struct/account';
import { prefix_cache__zalo_app } from '@src/const/redisKey/zalo';
import QueryDB_Get_Zalo_App_With_Account_Id from '../../queryDB/Get_Zalo_App_With_Account_Id';

class Handle_Get_Zalo_User_Infor {
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    async get_Zalo_App(req: Request<any, any, Get_Zalo_User_Body_Field>, res: Response, next: NextFunction) {
        const get_zalo_user_body = req.body;
        const zalo_app = get_zalo_user_body.zalo_app;
        const account_id = zalo_app.account_id;
        const role = account_type_enum.ADMIN;

        const my_response: My_Response_Field<Zalo_App_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Zalo_User_Infor-get_Zalo_App) !',
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
                const zalo_App: Zalo_App_Field = { ...result };

                const is_set = await this._serviceRedis.setData<Zalo_App_Field>(key_redis, zalo_app, time_expireat);
                if (!is_set) {
                    console.error('Failed to set zaloApp in Redis', key_redis);
                }

                res.locals.zalo_app = zalo_app;
                next();
                return;
            } else {
                my_response.message = 'Lấy thông tin zaloApp KHÔNG thành công 1 !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin zaloApp KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    }

    main = async (req: Request<any, any, Get_Zalo_User_Body_Field>, res: Response) => {
        const get_zalo_user_body = req.body;
        const zalo_app = res.locals.zalo_app as Zalo_App_Field;
        get_zalo_user_body.zalo_app = zalo_app;
        const user_id_by_app = get_zalo_user_body.user_id_by_app;

        const my_response: My_Response_Field<Zalo_User_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Zalo_User_Infor-main) !',
        };

        const key_redis = `${prefix_cache__zalo_user.key.with_zalo_app_id_user_id_by_app}_${zalo_app.id}_${user_id_by_app}`;
        const time_expireat = prefix_cache__zalo_user.time;

        const zalo_user_redis = await this._serviceRedis.getData<Zalo_User_Field>(key_redis);
        if (zalo_user_redis) {
            my_response.data = zalo_user_redis;
            my_response.message = 'Lấy thông tin zaloUser thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Zalo_User_Infor();
        queryDB.set_Get_Zalo_User_Body(get_zalo_user_body);

        try {
            const result = await queryDB.run();

            if (result) {
                const is_set = await this._serviceRedis.setData<Zalo_User_Field>(key_redis, result, time_expireat);
                if (!is_set) {
                    console.error('Failed to set zaloUser in Redis', key_redis);
                }

                my_response.data = result;
                my_response.message = 'Lấy thông tin zaloUserInfor thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin zaloUserInfor KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin zaloUserInfor KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Zalo_User_Infor;
