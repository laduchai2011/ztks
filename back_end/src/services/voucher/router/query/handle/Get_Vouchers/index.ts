import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Voucher_Field } from '@src/data_struct/voucher';
import { Get_Vouchers_Body_Field } from '@src/data_struct/voucher/body';
import QueryDB_Get_Vouchers from '../../queryDB/Get_Vouchers';

class Handle_Get_Vouchers {
    main = async (req: Request<any, any, Get_Vouchers_Body_Field>, res: Response) => {
        const get_vouchers_body = req.body;

        const my_response: My_Response_Field<Paged_Voucher_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Vouchers-main)',
        };

        const queryDB = new QueryDB_Get_Vouchers();
        queryDB.set_Get_Vouchers_Body(get_vouchers_body);

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

export default Handle_Get_Vouchers;
