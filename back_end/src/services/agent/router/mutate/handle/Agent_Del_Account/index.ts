import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Agent_Field } from '@src/data_struct/agent';
import { Agent_Del_Account_Body_Field } from '@src/data_struct/agent/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Agent_Del_Account from '../../mutateDB/Agent_Del_Account';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Agent_Del_Account {
    setup = async (req: Request<any, any, Agent_Del_Account_Body_Field>, res: Response, next: NextFunction) => {
        const my_Response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Agent_Del_Account-setup)',
        };

        const agent_del_account_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_Refresh_Token(refreshToken);

            if (verify_refreshToken === 'invalid') {
                my_Response.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(my_Response);
                return;
            }

            if (verify_refreshToken === 'expired') {
                my_Response.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(my_Response);
                return;
            }

            const { id } = verify_refreshToken;
            agent_del_account_body.account_id = id;
            res.locals.agent_del_account_body = agent_del_account_body;

            next();
            return;
        } else {
            my_Response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_Response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const agent_del_account_body = res.locals.agent_del_account_body as Agent_Del_Account_Body_Field;

        const my_response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Agent_Del_Account-main)',
        };

        const mutateDB = new MutateDB_Agent_Del_Account();
        mutateDB.set_Agent_Del_Account_Body(agent_del_account_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Xóa chỉ định thành viên cho agent thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Xóa chỉ định thành viên cho agent KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Xóa chỉ định thành viên cho agent KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Agent_Del_Account;
