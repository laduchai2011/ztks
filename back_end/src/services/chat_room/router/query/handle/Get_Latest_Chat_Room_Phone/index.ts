import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Chat_Room_Phone_Field } from '@src/data_struct/chat_room';
import { Get_Latest_Chat_Room_Phone_Body_Field } from '@src/data_struct/chat_room/body';
import QueryDB_Get_Latest_Chat_Room_Phone from '../../queryDB/Get_Latest_Chat_Room_Phone';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Latest_Chat_Room_Phone {
    setup = async (
        req: Request<any, any, Get_Latest_Chat_Room_Phone_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<Chat_Room_Phone_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Get_Latest_Chat_Room_Phone-setup) !',
        };

        const get_latest_chat_room_phone_body = req.body;
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
            get_latest_chat_room_phone_body.account_id = id;
            res.locals.get_latest_chat_room_phone_body = get_latest_chat_room_phone_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_latest_chat_room_phone_body = res.locals
            .get_latest_chat_room_phone_body as Get_Latest_Chat_Room_Phone_Body_Field;

        const my_response: My_Response_Field<Chat_Room_Phone_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Latest_Chat_Room_Phone-main)',
        };

        const queryDB = new QueryDB_Get_Latest_Chat_Room_Phone();
        queryDB.set_Get_Latest_Chat_Room_Phone_Body(get_latest_chat_room_phone_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy số điện thoại mới nhất của phòng chat thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy số điện thoại mới nhất của phòng chat KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy số điện thoại mới nhất của phòng chat KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Latest_Chat_Room_Phone;
