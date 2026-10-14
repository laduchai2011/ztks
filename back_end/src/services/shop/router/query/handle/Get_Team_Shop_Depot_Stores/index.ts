import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Cursor_Team_Shop_Depot_Store_Field } from '@src/data_struct/shop';
import { Get_Team_Shop_Depot_Stores_Body_Field } from '@src/data_struct/shop/body';
import QueryDB_Get_Team_Shop_Depot_Stores from '../../queryDB/Get_Team_Shop_Depot_Stores';

class Handle_Get_Team_Shop_Depot_Stores {
    main = async (req: Request<any, any, Get_Team_Shop_Depot_Stores_Body_Field>, res: Response) => {
        const get_team_shop_depot_stores_body = req.body;

        const my_response: My_Response_Field<Cursor_Team_Shop_Depot_Store_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Team_Shop_Depot_Stores-main)',
        };

        const queryDB = new QueryDB_Get_Team_Shop_Depot_Stores();
        queryDB.set_Get_Team_Shop_Depot_Stores_Body(get_team_shop_depot_stores_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy danh sách gian của kho của cửa hàng mà team có quyền thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy danh sách gian của kho của cửa hàng mà team có quyền KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy danh sách gian của kho của cửa hàng mà team có quyền KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Team_Shop_Depot_Stores;
