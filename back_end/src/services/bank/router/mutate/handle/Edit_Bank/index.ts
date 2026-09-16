import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Bank_Field } from '@src/dataStruct/bank';
import { Edit_Bank_Body_Field } from '@src/dataStruct/bank/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Edit_Bank from '../../mutateDB/Edit_Bank';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Edit_Bank {

    setup = async (req: Request<any, any, Edit_Bank_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Bank_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Bank-setup)',
        };

        const edit_bank_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_refresh_token(refreshToken);

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
            edit_bank_body.account_id = id;
            res.locals.edit_bank_body = edit_bank_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const edit_bank_body = res.locals.edit_bank_body as Edit_Bank_Body_Field;

        const my_response: My_Response_Field<Bank_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Bank-main)',
        };

        const mutateDB = new MutateDB_Edit_Bank();
        mutateDB.set_Edit_Bank_Body(edit_bank_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Chỉnh sửa thông tin ngân hàng thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Chỉnh sửa thông tin ngân hàng KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Chỉnh sửa thông tin ngân hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Edit_Bank;
