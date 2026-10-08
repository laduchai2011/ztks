import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Team_Field } from '@src/data_struct/team';
import { Get_Team_Leader_Body_Field } from '@src/data_struct/team/body';
import QueryDB_Get_Team_Leader from '../../queryDB/Get_Team_Leader';

class Handle_Get_Team_Leader {
    main = async (req: Request<any, any, Get_Team_Leader_Body_Field>, res: Response) => {
        const get_team_leader_body = req.body;

        const my_response: My_Response_Field<Team_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Team_Leader-main)',
        };

        const queryDB = new QueryDB_Get_Team_Leader();
        queryDB.set_Get_Team_Leader_Body(get_team_leader_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin trưởng nhóm thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin trưởng nhóm KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin trưởng nhóm KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Team_Leader;
