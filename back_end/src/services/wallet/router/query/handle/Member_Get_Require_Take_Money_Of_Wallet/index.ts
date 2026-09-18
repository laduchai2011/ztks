import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Member_Get_Require_Take_Money_Of_Wallet_Body_Field } from '@src/data_struct/wallet/body';
import QueryDB_Member_Get_Require_Take_Money_Of_Wallet from '../../queryDB/Member_Get_Require_Take_Money_Of_Wallet';

class Handle_Member_Get_Require_Take_Money_Of_Wallet {
    main = async (req: Request<any, any, Member_Get_Require_Take_Money_Of_Wallet_Body_Field>, res: Response) => {
        const member_get_require_take_money_of_wallet_body = req.body;

        const my_response: My_Response_Field<Require_Take_Money_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Member_Get_Require_Take_Money_Of_Wallet-main',
        };

        const queryDB = new QueryDB_Member_Get_Require_Take_Money_Of_Wallet();
        queryDB.set_Member_Get_Require_Take_Money_Of_Wallet_Body(member_get_require_take_money_of_wallet_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy yêu cầu rút tiền thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy yêu cầu rút tiền KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy yêu cầu rút tiền KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Member_Get_Require_Take_Money_Of_Wallet;
