import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { getMessageWithMsgId } from '../../queryMongo/GetMessageWithMsgId';

class Handle_GetMessageWithMsgId {
    constructor() {}

    main = async (req: Request<any, any, any, { chat_room_id: string; msg_id: string }>, res: Response) => {
        const chat_room_id = Number(req.query.chat_room_id) || -1;
        const msg_id = req.query.msg_id;

        const myResponse: MyResponse<MessageV1Field<ZaloMessageType>> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetMessageWithMsgId-main)',
        };

        const result = await getMessageWithMsgId(chat_room_id, msg_id);

        if (result) {
            myResponse.data = result;
            myResponse.message = 'Lấy tin nhắn thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        } else {
            myResponse.message = 'Lấy tin nhắn KHÔNG thành công !';
            res.status(200).json(myResponse);
            return;
        }
    };
}

export default Handle_GetMessageWithMsgId;
