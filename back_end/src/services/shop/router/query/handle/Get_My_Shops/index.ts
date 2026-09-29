import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Cursor_Shop_Field } from '@src/data_struct/shop';
import { Get_My_Shops_Body_Field } from '@src/data_struct/shop/body';
import QueryDB_Get_My_Shops from '../../queryDB/Get_My_Shops';

class Handle_Get_My_Shops {
    main = async (req: Request<any, any, Get_My_Shops_Body_Field>, res: Response) => {
        const get_my_shops_body = req.body;

        const my_response: My_Response_Field<Cursor_Shop_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_My_Shops-main)',
        };

        const queryDB = new QueryDB_Get_My_Shops();
        queryDB.set_Get_My_Shops_Body(get_my_shops_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy danh sách cửa hàng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy danh sách cửa hàng KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy danh sách cửa hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_My_Shops;
