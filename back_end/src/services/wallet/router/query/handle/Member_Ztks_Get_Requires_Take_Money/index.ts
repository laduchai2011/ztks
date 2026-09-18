import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Member_Ztks_Get_Requires_Take_Money_Body_Field } from '@src/data_struct/wallet/body';
import QueryDB_Member_Ztks_Get_Requires_Take_Money from '../../queryDB/Member_Ztks_Get_Requires_Take_Money';

class Handle_Member_Ztks_Get_Requires_Take_Money {
    main = async (req: Request<any, any, Member_Ztks_Get_Requires_Take_Money_Body_Field>, res: Response) => {
        const member_ztks_get_requires_take_money_body = req.body;

        const my_response: My_Response_Field<Paged_Require_Take_Money_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Member_Ztks_Get_Requires_Take_Money-main',
        };

        const queryDB = new QueryDB_Member_Ztks_Get_Requires_Take_Money();
        queryDB.set_Member_Ztks_Get_Requires_Take_Money_Body(member_ztks_get_requires_take_money_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những yêu cầu rút tiền thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những yêu cầu rút tiền KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những yêu cầu rút tiền KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Member_Ztks_Get_Requires_Take_Money;
