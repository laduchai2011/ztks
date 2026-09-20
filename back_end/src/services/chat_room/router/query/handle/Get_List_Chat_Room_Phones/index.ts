import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Chat_Room_Phone_Field } from '@src/data_struct/chat_room';
import { Get_List_Chat_Room_Phones_Body_Field } from '@src/data_struct/chat_room/body';
import QueryDB_Get_List_Chat_Room_Phones from '../../queryDB/Get_List_Chat_Room_Phones';
import { verify_Refresh_Token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_List_Chat_Room_Phones {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, Get_List_Chat_Room_Phones_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Chat_Room_Phone_Field[]> = {
            is_success: false,
            message: 'Băt đầu (Handle_Get_List_Chat_Room_Phones-setup) !',
        };

        const get_list_chat_room_phones_body = req.body;
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
            get_list_chat_room_phones_body.account_id = id;
            res.locals.get_list_chat_room_phones_body = get_list_chat_room_phones_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_list_chat_room_phones_body = res.locals
            .get_list_chat_room_phones_body as Get_List_Chat_Room_Phones_Body_Field;

        const my_response: My_Response_Field<Chat_Room_Phone_Field[]> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_List_Chat_Room_Phones-main)',
        };

        const queryDB = new QueryDB_Get_List_Chat_Room_Phones();
        queryDB.set_Get_List_Chat_Room_Phones_Body(get_list_chat_room_phones_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những số điện thoại phòng hội thoại thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những số điện thoại phòng hội thoại KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những số điện thoại phòng hội thoại KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_List_Chat_Room_Phones;
