import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Cursor_Team_Field } from '@src/data_struct/team';
import { Get_Teams_Body_Field } from '@src/data_struct/team/body';
import QueryDB_Get_Teams from '../../queryDB/Get_Teams';

class Handle_Get_Teams {
    main = async (req: Request<any, any, Get_Teams_Body_Field>, res: Response) => {
        const get_teams_body = req.body;

        const my_response: My_Response_Field<Cursor_Team_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Teams-main)',
        };

        const queryDB = new QueryDB_Get_Teams();
        queryDB.set_Get_Teams_Body(get_teams_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy danh sách nhóm thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy danh sách nhóm KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy danh sách nhóm KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Teams;
