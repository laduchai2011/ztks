import { Request, Response } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Bank_Field } from '@src/dataStruct/bank';
import { Get_Bank_With_Id_Body_Field } from '@src/dataStruct/bank/body';
import QueryDB_Get_Bank_With_Id from '../../queryDB/Get_Bank_With_Id';

class Handle_Get_Bank_With_Id {

    main = async (req: Request<any, any, Get_Bank_With_Id_Body_Field>, res: Response) => {
        const get_bank_with_id_body = req.body;

        const my_response: My_Response_Field<Bank_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_GetBankWithId-main !',
        };

        const queryDB = new QueryDB_Get_Bank_With_Id();
        queryDB.set_Get_Bank_With_Id_Body(get_bank_with_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin ngân hàng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin ngân hàng KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin ngân hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Bank_With_Id;
