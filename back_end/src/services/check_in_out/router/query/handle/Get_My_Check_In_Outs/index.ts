import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Check_In_Out_With_Date_Field } from '@src/data_struct/check_in_out';
import { Get_My_Check_In_Outs_Body_Field } from '@src/data_struct/check_in_out/body';
import QueryDB_Get_My_Check_In_Outs from '../../queryDB/Get_My_Check_In_Outs';

class Handle_Get_My_Check_In_Outs {
    main = async (req: Request<any, any, Get_My_Check_In_Outs_Body_Field>, res: Response) => {
        const get_my_check_in_outs_body = req.body;

        const my_response: My_Response_Field<Check_In_Out_With_Date_Field[]> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_My_Check_In_Outs-main)',
        };

        const queryDB = new QueryDB_Get_My_Check_In_Outs();
        queryDB.set_Get_My_Check_In_Outs_Body(get_my_check_in_outs_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những Check_In_Out thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những Check_In_Out KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những Check_In_Out KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_My_Check_In_Outs;
