import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Check_In_Out_Field } from '@src/data_struct/check_in_out';
import { Get_Check_In_Outs_With_Date_Body_Field } from '@src/data_struct/check_in_out/body';
import QueryDB_Get_Check_In_Outs_With_Date from '../../queryDB/Get_Check_In_Outs_With_Date';

class Handle_Get_Check_In_Outs_With_Date {
    main = async (req: Request<any, any, Get_Check_In_Outs_With_Date_Body_Field>, res: Response) => {
        const get_check_in_outs_with_date_body = req.body;

        const my_response: My_Response_Field<Check_In_Out_Field[]> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Check_In_Outs_With_Date-main)',
        };

        const queryDB = new QueryDB_Get_Check_In_Outs_With_Date();
        queryDB.set_Get_Check_In_Outs_With_Date_Body(get_check_in_outs_with_date_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những CheckInOut thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những CheckInOut KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những CheckInOut KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Check_In_Outs_With_Date;
