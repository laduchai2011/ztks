import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Agent_Field } from '@src/data_struct/agent';
import { Get_Agent_With_Agent_Account_Id_Body_Field } from '@src/data_struct/agent/body';
import QueryDB_Get_Agent_With_Agent_Account_Id from '../../queryDB/Get_Agent_With_Agent_Account_Id';

class Handle_Get_Agent_With_Agent_Account_Id {
    main = async (req: Request<any, any, Get_Agent_With_Agent_Account_Id_Body_Field>, res: Response) => {
        const get_agent_with_agent_account_id_body = req.body;

        const my_response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Agent_With_Agent_Account_Id-main !',
        };

        const queryDB = new QueryDB_Get_Agent_With_Agent_Account_Id();
        queryDB.set_Get_Agent_With_Agent_Account_Id_Body(get_agent_with_agent_account_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin agent thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin agent KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin agent KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Agent_With_Agent_Account_Id;
