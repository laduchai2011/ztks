import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Message_V1_Field } from '@src/data_struct/message_v1';
import { Message_V1_Body_Field } from '@src/data_struct/message_v1/body';
import { Zalo_Message_Type, Zalo_Call_Type } from '@src/data_struct/zalo/hook_data';
import { get_Messages_First, get_Messages_More } from '../../queryMongo/Get_Message_For_Chat_Screen';

class Handle_Get_Messages_For_Chat_Screen {
    main = async (req: Request<any, any, Message_V1_Body_Field>, res: Response) => {
        const message_v1_body = req.body;
        const chat_room_id = message_v1_body.chat_room_id;
        const limit = message_v1_body.size;
        const cursor = message_v1_body.cursor;
        let result: Paged_Message_V1_Field<Zalo_Message_Type, Zalo_Call_Type> | null = null;

        const my_response: My_Response_Field<Paged_Message_V1_Field<Zalo_Message_Type, Zalo_Call_Type>> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Messages_For_Chat_Screen-main)',
        };

        if (!cursor) {
            result = await get_Messages_First(chat_room_id, limit);
        } else {
            result = await get_Messages_More(chat_room_id, cursor, limit);
        }

        if (result) {
            my_response.data = result;
            my_response.message = 'Lấy tin nhắn phòng hội thoại thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        } else {
            my_response.message = 'Lấy tin nhắn phòng hội thoại KHÔNG thành công !';
            res.status(200).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Messages_For_Chat_Screen;
