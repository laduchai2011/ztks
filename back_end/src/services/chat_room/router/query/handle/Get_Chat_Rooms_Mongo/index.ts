import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Chat_Room_Mongo_Field } from '@src/data_struct/chat_room';
import { Chat_Rooms_Mongo_Body_Field } from '@src/data_struct/chat_room/body';
import { get_Chat_Rooms_Mongo } from '../../queryMongo/Get_Chat_Rooms';

class Handle_Get_Chat_Rooms_Mongo {
    main = async (req: Request<any, any, Chat_Rooms_Mongo_Body_Field>, res: Response) => {
        const chat_rooms_mongo_body = req.body;

        const my_response: My_Response_Field<Paged_Chat_Room_Mongo_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Chat_Rooms_Mongo-main)',
        };

        const result = await get_Chat_Rooms_Mongo(chat_rooms_mongo_body);
        my_response.data = result;
        my_response.message = 'Lấy danh sách phòng chat thành công !';
        my_response.is_success = true;
        res.status(200).json(my_response);
        return;
    };
}

export default Handle_Get_Chat_Rooms_Mongo;
