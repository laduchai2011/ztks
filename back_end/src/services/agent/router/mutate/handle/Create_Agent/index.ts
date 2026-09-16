import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Agent_Field } from '@src/dataStruct/agent';
import { Create_Agent_Body_Field } from '@src/dataStruct/agent/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Create_Agent from '../../mutateDB/Create_Agent';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Agent {

    setup = async (
        req: Request<any, any, Create_Agent_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Agent-setup)',
        };

        const create_agent_body = req.body;
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
            create_agent_body.account_id = id;
            res.locals.create_agent_body = create_agent_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_agent_body = res.locals.create_agent_body as Create_Agent_Body_Field;

        const my_response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Agent-main)',
        };

        const mutateDB = new MutateDB_Create_Agent();
        mutateDB.set_Create_Agent_Body(create_agent_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo agent thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo agent KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo agent KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Agent;
