import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Voucher_Field } from '@src/data_struct/voucher';
import { Get_Voucher_With_Order_Id_Body_Field } from '@src/data_struct/voucher/body';
import QueryDB_Get_Voucher_With_Order_Id from '../../queryDB/Get_Voucher_With_Order_Id';

class Handle_Get_Voucher_With_Order_Id {
    main = async (req: Request<any, any, Get_Voucher_With_Order_Id_Body_Field>, res: Response) => {
        const get_voucher_with_order_id_body = req.body;

        const my_response: My_Response_Field<Voucher_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Voucher_With_Order_Id-main)',
        };

        const queryDB = new QueryDB_Get_Voucher_With_Order_Id();
        queryDB.set_Get_Voucher_With_Order_Id_Body(get_voucher_with_order_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những voucher thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những voucher KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những voucher KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Voucher_With_Order_Id;
