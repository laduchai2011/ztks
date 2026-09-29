import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Shop_Pay_Field } from '@src/data_struct/shop';
import { Get_Latest_Shop_Pay_With_Shop_Id_Body_Field } from '@src/data_struct/shop/body';
import QueryDB_Get_Latest_Shop_Pay_With_Shop_Id from '../../queryDB/Get_Latest_Shop_Pay_With_Shop_Id';

class Handle_Get_Latest_Shop_Pay_With_Shop_Id {
    main = async (req: Request<any, any, Get_Latest_Shop_Pay_With_Shop_Id_Body_Field>, res: Response) => {
        const get_latest_shop_pay_with_shop_id_body = req.body;

        const my_response: My_Response_Field<Shop_Pay_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Latest_Shop_Pay_With_Shop_Id-main) !',
        };

        const queryDB = new QueryDB_Get_Latest_Shop_Pay_With_Shop_Id();
        queryDB.set_Get_Latest_Shop_Pay_With_Shop_Id_Body(get_latest_shop_pay_with_shop_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy hóa đơn mới nhất thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy hóa đơn mới nhất KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy hóa đơn mới nhất KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Latest_Shop_Pay_With_Shop_Id;
