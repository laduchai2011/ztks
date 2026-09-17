import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Chat_Room_Role_Field } from '@src/datastruct/chat_room';
import { Chat_Room_Role_With_Crid_Aaid_Body_Field } from '@src/datastruct/chat_room/body';
import QueryDB_Get_Chat_Room_Role_With_Crid_Aaid from '../../queryDB/Get_Chat_Room_Role_With_Crid_Aaid';
import { Cache_Get_Chat_Room_Role_With_Crid_Aaid } from '@src/const/redisKey/chat_room';

class Handle_Get_Chat_Room_Role_With_Crid_Aaid {
    private _serviceRedis = ServiceRedis.getInstance();
    private _cache_get_chat_room_role_with_crid_aaid = new Cache_Get_Chat_Room_Role_With_Crid_Aaid();

    constructor() {
        this._serviceRedis.init();
        this._cache_get_chat_room_role_with_crid_aaid.init();
    }

    main = async (req: Request<any, any, Chat_Room_Role_With_Crid_Aaid_Body_Field>, res: Response) => {
        const chat_room_role_with_crid_aaid_body = req.body;

        this._cache_get_chat_room_role_with_crid_aaid.set_Body(chat_room_role_with_crid_aaid_body);

        const my_response: My_Response_Field<Chat_Room_Role_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Chat_Room_Role_With_Crid_Aaid-main)',
        };

        const chat_room_role_cache = await this._cache_get_chat_room_role_with_crid_aaid.get_Data();
        if (chat_room_role_cache) {
            my_response.data = chat_room_role_cache;
            my_response.message = 'Lấy thông tin quyền truy cập phòng hội thoại thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
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

                my_response.data = rData;
                my_response.message = 'Lấy thông tin quyền truy cập phòng hội thoại thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Chat_Room_Role_With_Crid_Aaid;
