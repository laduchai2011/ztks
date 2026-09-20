import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type } from '@src/data_struct/zalo/hook_data';
import { get_Message_With_Msg_Id } from '../../queryMongo/Get_Message_With_Msg_Id';

class Handle_Get_Message_With_Msg_Id {
    main = async (req: Request<any, any, any, { chat_room_id: string; msg_id: string }>, res: Response) => {
        const chat_room_id = req.query.chat_room_id || '';
        const msg_id = req.query.msg_id;

        const my_response: My_Response_Field<Message_V1_Field<Zalo_Message_Type>> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Message_With_Msg_Id-main)',
        };

        const result = await get_Message_With_Msg_Id(chat_room_id, msg_id);

        if (result) {
            my_response.data = result;
            my_response.message = 'Lấy tin nhắn thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        } else {
            my_response.message = 'Lấy tin nhắn KHÔNG thành công !';
            res.status(200).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Message_With_Msg_Id;
