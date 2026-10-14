import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Depot_Role_Statistics_Field } from '@src/data_struct/shop';
import { Get_Depot_Role_Statistics_For_One_Team_Body_Field } from '@src/data_struct/shop/body';
import QueryDB_Get_Depot_Role_Statistics_For_One_Team from '../../queryDB/Get_Depot_Role_Statistics_For_One_Team';

class Handle_Get_Depot_Role_Statistics_For_One_Team {
    main = async (req: Request<any, any, Get_Depot_Role_Statistics_For_One_Team_Body_Field>, res: Response) => {
        const get_depot_role_statistics_for_one_team_body = req.body;

        const my_response: My_Response_Field<Depot_Role_Statistics_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Depot_Role_Statistics_For_One_Team-main) !',
        };

        const queryDB = new QueryDB_Get_Depot_Role_Statistics_For_One_Team();
        queryDB.set_Get_Depot_Role_Statistics_For_One_Team_Body(get_depot_role_statistics_for_one_team_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thống kê cho depot_role thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thống kê cho depot_role KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thống kê cho depot_role KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Depot_Role_Statistics_For_One_Team;
