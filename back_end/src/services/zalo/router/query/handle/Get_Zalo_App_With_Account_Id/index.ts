import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Zalo_App_Field } from '@src/data_struct/zalo';
import { Get_Zalo_App_With_Account_Id_Body_Field } from '@src/data_struct/zalo/body';
import QueryDB_Get_Zalo_App_With_Account_Id from '../../queryDB/Get_Zalo_App_With_Account_Id';
import { verify_refresh_token } from '@src/token';
import { account_type_enum, account_type_type } from '@src/data_struct/account';
import { prefix_cache__zalo_app } from '@src/const/redisKey/zalo';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Zalo_App_With_Account_Id {
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    checkRole = (
        req: Request<any, any, Get_Zalo_App_With_Account_Id_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const get_zalo_app_with_account_id_body: Get_Zalo_App_With_Account_Id_Body_Field = req.body;

        const my_response: My_Response_Field<Zalo_App_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Zalo_App_With_Account_Id (checkRole) !',
        };

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
            const account_id = get_zalo_app_with_account_id_body.account_id;
            if (id === account_id) {
                res.locals.role = account_type_enum.ADMIN;
            } else {
                res.locals.role = account_type_enum.MEMBER;
            }

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (req: Request<any, any, Get_Zalo_App_With_Account_Id_Body_Field>, res: Response) => {
        const role: account_type_type = res.locals.role as account_type_type;
        const get_zalo_app_with_account_id_body = req.body;
        const account_id = get_zalo_app_with_account_id_body.account_id;

        const my_response: My_Response_Field<Zalo_App_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Zalo_App_With_Account_Id (main) !',
        };

        const key_redis = `${prefix_cache__zalo_app.key.with_account_id}_${account_id}_${role}`;
        const time_expireat = prefix_cache__zalo_app.time;

        const zalo_app_redis = await this._serviceRedis.getData<Zalo_App_Field>(key_redis);
        if (zalo_app_redis) {
            my_response.data = zalo_app_redis;
            my_response.message = 'Lấy thông tin zaloApp thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Zalo_App_With_Account_Id();
        queryDB.set_Get_Zalo_App_With_Account_Id_Body(get_zalo_app_with_account_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const zalo_app: Zalo_App_Field = { ...result };
                if (role === account_type_enum.MEMBER) {
                    zalo_app.app_id = 'Bạn không phải admin';
                    zalo_app.app_secret = 'Bạn không phải admin';
                }

                const is_set = await this._serviceRedis.setData<Zalo_App_Field>(key_redis, zalo_app, time_expireat);
                if (!is_set) {
                    console.error('Failed to set zaloApp in Redis', key_redis);
                }

                my_response.data = zalo_app;
                my_response.message = 'Lấy thông tin zaloApp thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
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
}

export default Handle_Get_Zalo_App_With_Account_Id;
