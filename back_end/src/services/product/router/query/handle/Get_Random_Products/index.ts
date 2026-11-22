import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Cursor_Product_Field } from '@src/data_struct/product';
import { Get_Random_Products_Body_Field } from '@src/data_struct/product/body';
import QueryDB_Get_Random_Products from '../../queryDB/Get_Random_Products';

class Handle_Get_Random_Products {
    main = async (req: Request<any, any, Get_Random_Products_Body_Field>, res: Response) => {
        const get_random_products_body = req.body;

        const my_response: My_Response_Field<Cursor_Product_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Random_Products-main)',
        };

        const queryDB = new QueryDB_Get_Random_Products();
        queryDB.set_Get_Random_Products_Body_Field(get_random_products_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy danh sách sản phẩm thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy danh sách sản phẩm KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy danh sách sản phẩm KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Random_Products;
