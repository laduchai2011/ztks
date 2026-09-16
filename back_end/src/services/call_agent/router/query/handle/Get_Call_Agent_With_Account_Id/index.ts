import ServiceRedis from '@src/cache/cacheRedis';
import { verify_refresh_token } from '@src/token';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Call_Agent_Field } from '@src/dataStruct/call_agent';
import { Get_Call_Agent_With_Account_Id_Body_Field } from '@src/dataStruct/call_agent/body';
import QueryDB_Get_Call_Agent_With_Account_Id from '../../queryDB/Get_Call_Agent_With_Account_Id';
import { Cache_Get_Call_Agent_With_Account_Id } from '@src/const/redisKey/call_agent';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Call_Agent_With_Account_Id {
  
    private _serviceRedis = ServiceRedis.getInstance();
    private _cache_get_call_agent_with_account_id = new Cache_Get_Call_Agent_With_Account_Id();

    constructor() {
        this._serviceRedis.init();
        this._cache_get_call_agent_with_account_id.init();
    }

    setup = async (req: Request<any, any, Get_Call_Agent_With_Account_Id_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Call_Agent_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Get_Call_Agent_With_Account_Id-setup) !',
        };

        const get_call_agent_with_account_id_body = req.body;
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
            get_call_agent_with_account_id_body.account_id = id;
            res.locals.get_call_agent_with_account_id_body = get_call_agent_with_account_id_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_call_agent_with_account_id_body = res.locals
            .get_call_agent_with_account_id_body as Get_Call_Agent_With_Account_Id_Body_Field;

        this._cache_get_call_agent_with_account_id.set_Body(get_call_agent_with_account_id_body);

        const my_response: My_Response_Field<Call_Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Call_Agent_With_Account_Id-main)',
        };

        const call_agent_cache = await this._cache_get_call_agent_with_account_id.get_Data();
        if (call_agent_cache) {
            my_response.data = call_agent_cache;
            my_response.message = 'Lấy thông tin callAgent thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Call_Agent_With_Account_Id();
        queryDB.set_Get_Call_Agent_With_Account_Id_Body(get_call_agent_with_account_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const rData = result;

                this._cache_get_call_agent_with_account_id.set_Data(rData);

                my_response.data = rData;
                my_response.message = 'Lấy thông tin callAgent thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin callAgent KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin callAgent KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Call_Agent_With_Account_Id;
