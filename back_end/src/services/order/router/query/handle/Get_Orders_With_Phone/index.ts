import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Order_Field, Paged_Order_Field } from '@src/data_struct/order';
import { Get_Orders_With_Phone_Body_Field } from '@src/data_struct/order/body';
import QueryDB_Get_Orders_With_Phone from '../../queryDB/Get_Orders_With_Phone';

class Handle_Get_Orders_With_Phone {
    main = async (req: Request<any, any, Get_Orders_With_Phone_Body_Field>, res: Response) => {
        const get_orders_with_phone_body = req.body;

        const my_response: My_Response_Field<Paged_Order_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Orders_With_Phone-main)',
        };

        const queryDB = new QueryDB_Get_Orders_With_Phone();
        queryDB.set_Get_Orders_With_Phone_Body(get_orders_with_phone_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những đơn hàng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những đơn hàng KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những đơn hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Orders_With_Phone;
