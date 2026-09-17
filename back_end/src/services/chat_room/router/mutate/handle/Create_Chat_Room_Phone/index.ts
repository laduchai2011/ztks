import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Chat_Room_Phone_Field } from '@src/datastruct/chat_room';
import { Create_Chat_Room_Phone_Body_Field } from '@src/datastruct/chat_room/body';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';
import MutateDB_Create_Chat_Room_Phone from '../../mutateDB/Create_Chat_Room_Phone';

class Handle_Create_Chat_Room_Phone {
    
    setup = async (req: Request<any, any, Create_Chat_Room_Phone_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Chat_Room_Phone_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Create_Chat_Room_Phone-setup) !',
        };

        const create_chat_room_phone_body = req.body;
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
            create_chat_room_phone_body.account_id = id;
            res.locals.create_chat_room_phone_body = create_chat_room_phone_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_chat_room_phone_body = res.locals.create_chat_room_phone_body as Create_Chat_Room_Phone_Body_Field;

        const my_response: My_Response_Field<Chat_Room_Phone_Field> = {
            is_success: false,
            message: 'Bắt đầu tạo (Handle_Create_Chat_Room_Phone-main) !',
        };

        const mutateDB = new MutateDB_Create_Chat_Room_Phone();
        mutateDB.set_Create_Chat_Room_Phone_Body(create_chat_room_phone_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo ChatRoomPhone thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo ChatRoomPhone KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            console.error(error);
            my_response.message = 'Tạo ChatRoomPhone KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Chat_Room_Phone;
