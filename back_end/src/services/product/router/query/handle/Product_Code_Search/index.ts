import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Product_Code_Hit_Field } from '@src/data_struct/product';
import { Product_Code_Search_Body_Field } from '@src/data_struct/product/body';
import { QueryDB_Product_Code_Search } from '../../queryDB/Product_Code_Search';

class Handle_Product_Code_Search {
    main = async (req: Request<any, any, Product_Code_Search_Body_Field>, res: Response) => {
        const product_code_search_body = req.body;

        const my_response: My_Response_Field<Product_Code_Hit_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Product_Code_Search-main !',
        };

        if (product_code_search_body.search_content.trim().length === 0) {
            return;
        }

        const result = await QueryDB_Product_Code_Search(product_code_search_body);

        try {
            if (result) {
                my_response.data = result.hits as Product_Code_Hit_Field;
                my_response.message = 'Tìm kiếm thông tin mã sản phẩm thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tìm kiếm thông tin mã sản phẩm KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tìm kiếm thông tin mã sản phẩm KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Product_Code_Search;
