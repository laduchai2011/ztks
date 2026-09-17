import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Chat_Session_Field } from '@src/datastruct/chat_session';
import { Chat_Session_Body_Field } from '@src/datastruct/chat_session/body';
import { Zalo_Oa_Field } from '@src/dataStruct/zalo';
import { Is_My_Oa_Body_Field } from '@src/dataStruct/zalo/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Create_Chat_Session from '../../mutateDB/Create_Chat_Session';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Chat_Session {
    setup = async (req: Request<any, any, Chat_Session_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Chat_Session_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Chat_Session-setup)',
        };

        const chat_session_body = req.body;
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
            chat_session_body.selected_account_id = id;
            chat_session_body.account_id = id;
            res.locals.chat_session_body = chat_session_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    is_My_Oa = async (_: Request, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Zalo_Oa_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Chat_Session-setup_isMyOa)',
        };

        const chat_session_body = res.locals.chat_session_body as Chat_Session_Body_Field;

        const is_my_oa_body: Is_My_Oa_Body_Field = {
            id: chat_session_body.zalo_oa_id,
            account_id: chat_session_body.account_id,
        };

        const mutateDB = new MutateDB_Create_Chat_Session();
        mutateDB.set_Is_My_Oa_Body(is_my_oa_body);

        try {
            const result = await mutateDB.is_My_Oa();
            if (result) {
                my_response.message = 'Kiểm tra oa có phải của bạn không thành công !';
                my_response.is_success = true;
                my_response.data = result;
                next();
            } else {
                my_response.message = 'Bạn không là admin của OA !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Bạn không là admin của OA !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const chat_session_body = res.locals.chat_session_body as Chat_Session_Body_Field;

        const my_response: My_Response_Field<Chat_Session_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Chat_Session-main)',
        };

        const mutateDB = new MutateDB_Create_Chat_Session();
        mutateDB.set_Chat_Session_Body(chat_session_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo phiên chat thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo phiên chat KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo phiên chat KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Chat_Session;
