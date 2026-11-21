import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Product_Code_Total_Field } from '@src/data_struct/product';
import { Get_Product_Code_Total_Body_Field } from '@src/data_struct/product/body';
import QueryDB_Get_Product_Code_Total from '../../queryDB/Get_Product_Code_Total';

class Handle_Get_Product_Code_Total {
    main = async (req: Request<any, any, Get_Product_Code_Total_Body_Field>, res: Response) => {
        const get_product_code_total_body = req.body;

        const my_response: My_Response_Field<Product_Code_Total_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Product_Code_Total-main !',
        };

        const queryDB = new QueryDB_Get_Product_Code_Total();
        queryDB.set_Get_Product_Code_Total_Body(get_product_code_total_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin tổng số mã sản phẩm thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin tổng số mã sản phẩm KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin tổng số mã sản phẩm KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Product_Code_Total;
