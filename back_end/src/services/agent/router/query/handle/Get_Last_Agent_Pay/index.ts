import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Agent_Pay_Field } from '@src/data_struct/agent';
import { Get_Last_Agent_Pay_Body_Field } from '@src/data_struct/agent/body';
import QueryDB_Get_Last_Agent_Pay from '../../queryDB/Get_Last_Agent_Pay';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Last_Agent_Pay {
    setup = (req: Request<any, any, Get_Last_Agent_Pay_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Agent_Pay_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Last_Agent_Pay-setup)',
        };

        const get_last_agent_pay_body = req.body;
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
            if (get_last_agent_pay_body.account_id.length === 0) {
                get_last_agent_pay_body.account_id = id;
            }
            res.locals.get_last_agent_pay_body = get_last_agent_pay_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_last_agent_pay_body = res.locals.get_last_agent_pay_body as Get_Last_Agent_Pay_Body_Field;

        const my_response: My_Response_Field<Agent_Pay_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Last_Agent_Pay-main !',
        };

        const queryDB = new QueryDB_Get_Last_Agent_Pay();
        queryDB.set_Get_Last_Agent_Pay_Body(get_last_agent_pay_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin last-pay thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin last-pay KHÔNG thành công 1 !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin last-pay KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Last_Agent_Pay;
