import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Leave_All_Account_Receive_Message_Body_Field } from '@src/dataStruct/account/body';
import MutateDB_Leave_All_Account_Receive_Message from '../../mutateDB/Leave_All_Account_Receive_Message';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Leave_All_Account_Receive_Message {

    setup = async (
        req: Request<any, any, Leave_All_Account_Receive_Message_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<boolean> = {
            is_success: false,
            message: 'Băt đầu (Handle_Leave_All_Account_Receive_Message-setup) !',
        };

        const leave_all_account_receive_message_body = req.body;
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
            leave_all_account_receive_message_body.account_id = id;
            res.locals.leave_all_account_receive_message_body = leave_all_account_receive_message_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const leave_all_account_receive_message_body = res.locals
            .leave_all_account_receive_message_body as Leave_All_Account_Receive_Message_Body_Field;

        const my_response: My_Response_Field<boolean> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Leave_All_Account_Receive_Message-main)',
        };

        const mutateDB = new MutateDB_Leave_All_Account_Receive_Message();
        mutateDB.set_Leave_All_Account_Receive_Message_Body(leave_all_account_receive_message_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Rời khỏi tất cả tài khoản nhận tin nhắn thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Rời khỏi tất cả tài khoản nhận tin nhắn KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Rời khỏi tất cả tài khoản nhận tin nhắn KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Leave_All_Account_Receive_Message;
