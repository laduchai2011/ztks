import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Chat_Session_Field } from '@src/data_struct/chat_session';
import { Update_Selected_Account_Id_Of_Chat_Session_Body_Field } from '@src/data_struct/chat_session/body';
import MutateDB_Update_Selected_Account_Id_Of_Chat_Session from '../../mutateDB/Update_Selected_Account_Id_Of_Chat_Session';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Update_Selected_Account_Id_Of_Chat_Session {
    setup = async (
        req: Request<any, any, Update_Selected_Account_Id_Of_Chat_Session_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<Chat_Session_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Update_Selected_Account_Id_Of_Chat_Session-setup)',
        };

        const update_selected_account_id_of_chat_session_body = req.body;
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
            update_selected_account_id_of_chat_session_body.account_id = id;
            res.locals.update_selected_account_id_of_chat_session_body =
                update_selected_account_id_of_chat_session_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const update_selected_account_id_of_chat_session_body = res.locals
            .update_selected_account_id_of_chat_session_body as Update_Selected_Account_Id_Of_Chat_Session_Body_Field;

        const my_response: My_Response_Field<Chat_Session_Field> = {
            is_success: false,
            message: 'Băt đầu cập nhật (Handle_Update_Selected_Account_Id_Of_Chat_Session-main) !',
        };

        const mutateDB = new MutateDB_Update_Selected_Account_Id_Of_Chat_Session();
        mutateDB.set_Update_Selected_Account_Id_Of_Chat_Session_Body(update_selected_account_id_of_chat_session_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Cập nhật Update_Selected_Account_Id_Of_Chat_Session thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Cập nhật Update_Selected_Account_Id_Of_Chat_Session KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Cập nhật Update_Selected_Account_Id_Of_Chat_Session KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Update_Selected_Account_Id_Of_Chat_Session;
