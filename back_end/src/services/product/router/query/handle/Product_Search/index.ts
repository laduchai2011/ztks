import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Product_Hit_Field } from '@src/data_struct/product';
import { Product_Search_Body_Field } from '@src/data_struct/product/body';
import { QueryElastic_Product_Search } from '../../queryElastic/Product_Search';

class Handle_Product_Search {
    main = async (req: Request<any, any, Product_Search_Body_Field>, res: Response) => {
        const product_search_body = req.body;

        const my_response: My_Response_Field<Product_Hit_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Product_Search-main !',
        };

        if (product_search_body.search_content.trim().length === 0) {
            return;
        }

        const result = await QueryElastic_Product_Search(product_search_body);

        try {
            if (result) {
                my_response.data = result.hits as Product_Hit_Field;
                my_response.message = 'Tìm kiếm thông tin sản phẩm thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tìm kiếm thông tin sản phẩm KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tìm kiếm thông tin sản phẩm KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Product_Search;
