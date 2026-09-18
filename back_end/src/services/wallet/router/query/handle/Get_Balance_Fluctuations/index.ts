import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Balance_Fluctuation_Field } from '@src/data_struct/wallet';
import { Get_Balance_Fluctuations_Body_Field } from '@src/data_struct/wallet/body';
import QueryDB_Get_Balance_Fluctuations from '../../queryDB/Get_Balance_Fluctuations';

class Handle_Get_Balance_Fluctuations {
    main = async (req: Request<any, any, Get_Balance_Fluctuations_Body_Field>, res: Response) => {
        const get_balance_fluctuations_body = req.body;

        const my_response: My_Response_Field<Balance_Fluctuation_Field[]> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Balance_Fluctuations-main)',
        };

        const queryDB = new QueryDB_Get_Balance_Fluctuations();
        queryDB.set_Get_Balance_Fluctuations_Body(get_balance_fluctuations_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những biến động số dư thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những biến động số dư KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những biến động số dư KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Balance_Fluctuations;
