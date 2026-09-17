import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { Get_Chat_Room_With_Id_Body_Field } from '@src/data_struct/chat_room/body';
import QueryDB_Get_Chat_Room_With_Id from '../../queryDB/Get_Chat_Room_With_Id';
import { Cache_Get_Chat_Room_With_Id } from '@src/const/redisKey/chat_room';

class Handle_Get_Chat_Room_With_Id {
    private _serviceRedis = ServiceRedis.getInstance();
    private _cache_get_chat_room_with_id = new Cache_Get_Chat_Room_With_Id({
        log_prameter: 'Handle_Get_Chat_Room_With_Id',
    });

    constructor() {
        this._serviceRedis.init();
        this._cache_get_chat_room_with_id.init();
    }

    main = async (req: Request<any, any, Get_Chat_Room_With_Id_Body_Field>, res: Response) => {
        const get_chat_room_with_id_body = req.body;

        this._cache_get_chat_room_with_id.set_Body({ id: get_chat_room_with_id_body.id });

        const my_response: My_Response_Field<Chat_Room_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Chat_Room_With_Id-main)',
        };

        const chat_room_cache = await this._cache_get_chat_room_with_id.get_Data();
        if (chat_room_cache) {
            my_response.data = chat_room_cache;
            my_response.message = 'Lấy phòng chat thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Chat_Room_With_Id();
        queryDB.set_Get_Chat_Room_With_Id_Body(get_chat_room_with_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const r_chatRoom = result;

                this._cache_get_chat_room_with_id.set_Data(r_chatRoom);

                my_response.data = r_chatRoom;
                my_response.message = 'Lấy phòng chat thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy phòng chat KHÔNG thành công 1 !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy phòng chat KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Chat_Room_With_Id;
