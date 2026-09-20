import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Account_Receive_Message_Field } from '@src/data_struct/account';
import { Create_Account_Receive_Message_Body_Field } from '@src/data_struct/account/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Create_Account_Receive_Message from '../../mutateDB/Create_Account_Receive_Message';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Account_Receive_Message {
    setup = async (
        req: Request<any, any, Create_Account_Receive_Message_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<Account_Receive_Message_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Account_Receive_Message-setup)',
        };

        const create_account_receive_message_body = req.body;
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
            create_account_receive_message_body.account_id = id;
            res.locals.create_account_receive_message_body = create_account_receive_message_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_account_receive_message_body = res.locals
            .create_account_receive_message_body as Create_Account_Receive_Message_Body_Field;

        const my_response: My_Response_Field<Account_Receive_Message_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Account_Receive_Message-main)',
        };

        const mutateDB = new MutateDB_Create_Account_Receive_Message();
        mutateDB.set_Create_Account_Receive_Message_Body(create_account_receive_message_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo thiết lập tài khoản nhận tin nhắn thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo thiết lập tài khoản nhận tin nhắn KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo thiết lập tài khoản nhận tin nhắn KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Account_Receive_Message;
