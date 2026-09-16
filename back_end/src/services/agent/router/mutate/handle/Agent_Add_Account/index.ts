import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Agent_Field } from '@src/dataStruct/agent';
import { Agent_Add_Account_Body_Field } from '@src/dataStruct/agent/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Agent_Add_Account from '../../mutateDB/Agent_Add_Account';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Agent_Add_Account {

    setup = async (req: Request<any, any, Agent_Add_Account_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Agent_Add_Account-setup)',
        };

        const agent_add_account_body = req.body;
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
            agent_add_account_body.account_id = id;
            res.locals.agent_add_account_body = agent_add_account_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const agent_add_account_body = res.locals.agent_add_account_body as Agent_Add_Account_Body_Field;

        const my_response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Agent_Add_Account-main)',
        };

        const mutateDB = new MutateDB_Agent_Add_Account();
        mutateDB.set_Agent_Add_Account_Body(agent_add_account_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Chỉ định thành viên cho agent thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Chỉ định thành viên cho agent KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Chỉ định thành viên cho agent KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Agent_Add_Account;
