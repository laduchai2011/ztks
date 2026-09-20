import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Bank_Field } from '@src/data_struct/bank';
import { Delete_Bank_Body_Field } from '@src/data_struct/bank/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Delete_Bank from '../../mutateDB/Delete_Bank';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Delete_Bank {
    setup = async (req: Request<any, any, Delete_Bank_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Bank_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Delete_Bank-setup)',
        };

        const delete_bank_body = req.body;
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
            delete_bank_body.account_id = id;
            res.locals.delete_bank_body = delete_bank_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const delete_bank_body = res.locals.delete_bank_body as Delete_Bank_Body_Field;

        const my_response: My_Response_Field<Bank_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Delete_Bank-main)',
        };

        const mutateDB = new MutateDB_Delete_Bank();
        mutateDB.set_Delete_Bank_Body(delete_bank_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Xóa thông tin ngân hàng thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Xóa thông tin ngân hàng KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Xóa thông tin ngân hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Delete_Bank;
