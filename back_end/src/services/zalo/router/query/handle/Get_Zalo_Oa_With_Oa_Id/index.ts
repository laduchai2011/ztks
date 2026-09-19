import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Get_Zalo_Oa_With_Oa_Id_Body_Field } from '@src/data_struct/zalo/body';
import QueryDB_Get_Zalo_Oa_With_Oa_Id from '../../queryDB/Get_Zalo_Oa_With_Oa_Id';
import { verify_refresh_token } from '@src/token';
import { account_type_enum, account_type_type } from '@src/data_struct/account';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Zalo_Oa_With_Oa_Id {
    check_Role = (req: Request<any, any, Get_Zalo_Oa_With_Oa_Id_Body_Field>, res: Response, next: NextFunction) => {
        const get_zalo_oa_with_oa_id_body = req.body;

        const my_response: My_Response_Field<Zalo_Oa_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Zalo_Oa_With_Oa_Id-check_Role) !',
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
            const account_id = get_zalo_oa_with_oa_id_body.account_id;
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

    main = async (req: Request<any, any, Get_Zalo_Oa_With_Oa_Id_Body_Field>, res: Response) => {
        const role: account_type_type = res.locals.role as account_type_type;
        const get_zalo_oa_with_oa_id_body = req.body;
        // const id = zaloOaWithIdBody.id;

        const my_response: My_Response_Field<Zalo_Oa_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Zalo_Oa_With_Oa_Id-main) !',
        };

        // const keyRedis = `${prefix_cache_zaloOa.key.with_id}_${id}_${role}`;
        // const timeExpireat = prefix_cache_zaloOa.time;

        // const zaloOa_redis = await this._serviceRedis.getData<ZaloOaField>(keyRedis);
        // if (zaloOa_redis) {
        //     myResponse.data = zaloOa_redis;
        //     myResponse.message = 'Lấy thông tin zaloOa thành công !';
        //     myResponse.isSuccess = true;
        //     res.status(200).json(myResponse);
        //     return;
        // }

        const queryDB = new QueryDB_Get_Zalo_Oa_With_Oa_Id();
        queryDB.set_Get_Zalo_Oa_With_Oa_Id_Body(get_zalo_oa_with_oa_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const zalo_oa: Zalo_Oa_Field = { ...result };
                if (role === account_type_enum.MEMBER) {
                    // zaloOa.oaId = 'Bạn không phải admin';
                    zalo_oa.oa_secret = 'Bạn không phải admin';
                }

                // const isSet = await this._serviceRedis.setData<ZaloOaField>(keyRedis, zaloOa, timeExpireat);
                // if (!isSet) {
                //     console.error('Failed to set zaloOa in Redis', keyRedis);
                // }

                my_response.data = zalo_oa;
                my_response.message = 'Lấy thông tin zaloOa thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
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
}

export default Handle_Get_Zalo_Oa_With_Oa_Id;
