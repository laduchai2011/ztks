import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Store_Hit_Field } from '@src/data_struct/shop';
import { Store_Search_Body_Field } from '@src/data_struct/shop/body';
import { QueryElastic_Store_Search } from '../../queryElastic/Store_Search';

class Handle_Store_Search {
    main = async (req: Request<any, any, Store_Search_Body_Field>, res: Response) => {
        const store_search_body = req.body;

        const my_response: My_Response_Field<Store_Hit_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Store_Search-main !',
        };

        if (store_search_body.search_content.trim().length === 0) {
            return;
        }

        const result = await QueryElastic_Store_Search(store_search_body);

        try {
            if (result) {
                my_response.data = result.hits as Store_Hit_Field;
                my_response.message = 'Tìm kiếm gian hàng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tìm kiếm gian hàng KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tìm kiếm gian hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Store_Search;
