import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Order_Status_Field } from '@src/data_struct/order';
import { Get_All_Order_Status_Body_Field } from '@src/data_struct/order/body';
import QueryDB_Get_All_Order_Status from '../../queryDB/Get_All_Order_Status';

class Handle_Get_All_Order_Status {
    main = async (req: Request<any, any, Get_All_Order_Status_Body_Field>, res: Response) => {
        const get_all_order_status_body = req.body;

        const my_response: My_Response_Field<Order_Status_Field[]> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_All_Order_Status-main)',
        };

        const queryDB = new QueryDB_Get_All_Order_Status();
        queryDB.set_Get_All_Order_Status_Body(get_all_order_status_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy tất cả trạng thái đơn hàng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy tất cả trạng thái đơn hàng KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy tất cả trạng thái đơn hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_All_Order_Status;
