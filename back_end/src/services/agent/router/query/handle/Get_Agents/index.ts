import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Paged_Agent_Field } from '@src/dataStruct/agent';
import { Get_Agents_Body_Field } from '@src/dataStruct/agent/body';
import QueryDB_Get_Members from '../../queryDB/Get_Agents';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Agents {

    setup = (req: Request<any, any, Get_Agents_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Paged_Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Agents-setup)',
        };

        const get_agents_body = req.body;
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
            get_agents_body.account_id = id;
            res.locals.get_agents_body = get_agents_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_agents_body = res.locals.get_agents_body as Get_Agents_Body_Field;

        const my_response: My_Response_Field<Paged_Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Agents-main)',
        };

        const queryDB = new QueryDB_Get_Members();
        queryDB.set_Get_Agents_Body(get_agents_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những agent thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những agent KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những agent KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Agents;
