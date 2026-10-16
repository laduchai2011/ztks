import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Depot_Field } from '@src/data_struct/shop';
import { Get_Depot_By_Id_Body_Field } from '@src/data_struct/shop/body';
import QueryDB_Get_Depot_By_Id from '../../queryDB/Get_Depot_By_Id';

class Handle_Get_Depot_By_Id {
    main = async (req: Request<any, any, Get_Depot_By_Id_Body_Field>, res: Response) => {
        const get_depot_by_id = req.body;

        const my_response: My_Response_Field<Depot_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Depot_By_Id-main !',
        };

        const queryDB = new QueryDB_Get_Depot_By_Id();
        queryDB.set_Get_Depot_By_Id_Body(get_depot_by_id);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin kho thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin kho KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin kho KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Depot_By_Id;
