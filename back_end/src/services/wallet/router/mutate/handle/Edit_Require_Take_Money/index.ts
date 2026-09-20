import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Edit_Require_Take_Money_Body_Field } from '@src/data_struct/wallet/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Edit_Require_Take_Money from '../../mutateDB/Edit_Require_Take_Money';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Edit_Require_Take_Money {
    setup = async (req: Request<any, any, Edit_Require_Take_Money_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Require_Take_Money_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Require_Take_Money-setup)',
        };

        const edit_require_take_money_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_Refresh_Token(refreshToken);

            if (verify_refreshToken === 'invalid') {
                my_response.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            if (verify_refreshToken === 'expired') {
                my_response.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            const { id } = verify_refreshToken;
            edit_require_take_money_body.account_id = id;
            res.locals.edit_require_take_money_body = edit_require_take_money_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const edit_require_take_money_body = res.locals
            .edit_require_take_money_body as Edit_Require_Take_Money_Body_Field;

        const my_response: My_Response_Field<Require_Take_Money_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Require_Take_Money-main)',
        };

        const mutateDB = new MutateDB_Edit_Require_Take_Money();
        mutateDB.set_Edit_Require_Take_Money_Body(edit_require_take_money_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Chỉnh sửa yêu cầu rút tiền thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Chỉnh sửa yêu cầu rút tiền KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Chỉnh sửa yêu cầu rút tiền KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Edit_Require_Take_Money;
