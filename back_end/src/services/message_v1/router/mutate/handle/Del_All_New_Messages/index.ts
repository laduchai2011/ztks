import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { New_Message_V1_Field } from '@src/data_struct/message_v1';
import { Del_New_Messages_Body_Field } from '@src/data_struct/message_v1/body';
import { Chat_Room_Role_Field } from '@src/data_struct/chat_room';
import { Chat_Room_Role_With_Crid_Aaid_Body_Field } from '@src/data_struct/chat_room/body';
import { Zalo_Message_Type } from '@src/data_struct/zalo/hook_data';
import { del_All_New_Messages } from '../../mutateMongo/Del_All_New_Messages';
import { verify_refresh_token } from '@src/token';
import { Cache_Get_Chat_Room_Role_With_Crid_Aaid } from '@src/const/redisKey/chat_room';
import QueryDB_Get_Chat_Room_Role_With_Crid_Aaid from '../../queryDB/Get_Chat_Room_Role_With_Crid_Aaid';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Del_All_New_Messages {
    private _serviceRedis = ServiceRedis.getInstance();
    private _cache_get_chat_room_role_with_crid_aaid = new Cache_Get_Chat_Room_Role_With_Crid_Aaid();

    constructor() {
        this._serviceRedis.init();
        this._cache_get_chat_room_role_with_crid_aaid.init();
    }

    setup = (req: Request<any, any, any, { chat_room_id: string }>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<New_Message_V1_Field<Zalo_Message_Type>[]> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Del_All_New_Messages-setup)',
        };

        const chat_room_id = req.query.chat_room_id;
        const chat_room_role_with_crid_aaid_body: Chat_Room_Role_With_Crid_Aaid_Body_Field = {
            chat_room_id: chat_room_id,
            authorized_account_id: '',
        };

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
            chat_room_role_with_crid_aaid_body.authorized_account_id = id;
            res.locals.chat_room_role_with_crid_aaid_body = chat_room_role_with_crid_aaid_body;
            res.locals.my_account_id = id;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    get_Role = async (_: Request, res: Response, next: NextFunction) => {
        const chat_room_role_with_crid_aaid_body = res.locals
            .chat_room_role_with_crid_aaid_body as Chat_Room_Role_With_Crid_Aaid_Body_Field;
        const crid = chat_room_role_with_crid_aaid_body.chat_room_id;
        const aaid = chat_room_role_with_crid_aaid_body.authorized_account_id;

        this._cache_get_chat_room_role_with_crid_aaid.set_Body({ chat_room_id: crid, authorized_account_id: aaid });

        const my_response: My_Response_Field<New_Message_V1_Field<Zalo_Message_Type>> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Del_All_New_Messages-get_Role)',
        };

        const chat_room_role_cache = await this._cache_get_chat_room_role_with_crid_aaid.get_Data();
        if (chat_room_role_cache) {
            res.locals.chat_room_role = chat_room_role_cache;
            next();
            return;
        }

        const queryDB = new QueryDB_Get_Chat_Room_Role_With_Crid_Aaid();
        queryDB.set_Chat_Room_Role_With_Crid_Aaid_Body(chat_room_role_with_crid_aaid_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const rData = result;

                this._cache_get_chat_room_role_with_crid_aaid.set_Fk_Crid(rData.chat_room_id);
                this._cache_get_chat_room_role_with_crid_aaid.set_Data(rData);

                res.locals.chat_room_role = rData;
                next();
                return;
            } else {
                my_response.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công 1 !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    is_Pass_Role = async (_: Request, res: Response, next: NextFunction) => {
        const chat_room_role = res.locals.chat_room_role as Chat_Room_Role_Field;

        const my_response: My_Response_Field<Chat_Room_Role_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Del_All_New_Messages-isPassRole)',
        };

        const is_read = chat_room_role.is_read;
        // const isSend = chatRoomRole.isSend;

        if (is_read) {
            next();
            return;
        } else {
            my_response.message = 'Bạn không có quyền xem nội dung này !';
            res.status(200).json(my_response);
            return;
        }
    };

    main = async (req: Request<any, any, any, { chat_room_id: string }>, res: Response) => {
        const chat_room_id = req.query.chat_room_id || '';
        const my_account_id = res.locals.my_account_id as string;

        const del_new_messages_body: Del_New_Messages_Body_Field = {
            chat_room_id: chat_room_id,
            account_id: my_account_id,
        };

        const my_Response: My_Response_Field<any> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Del_All_New_Messages-main)',
        };

        try {
            const r = await del_All_New_Messages(del_new_messages_body);
            my_Response.data = r;
            my_Response.message = 'Lấy tất cả tin nhắn mới thành công !';
            my_Response.is_success = true;
            res.status(200).json(my_Response);
            return;
        } catch (error) {
            my_Response.err = error;
            my_Response.message = 'Lấy tất cả tin nhắn mới KHÔNG thành công !';
            res.status(200).json(my_Response);
            return;
        }
    };
}

export default Handle_Del_All_New_Messages;
