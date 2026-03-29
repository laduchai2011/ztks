import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { getMessageWithId } from '../../queryMongo/GetMessageWithId';

class Handle_GetMessageWithId {
    constructor() {}

    main = async (req: Request<any, any, any, { id: string }>, res: Response) => {
        const id = req.query.id;

        const myResponse: MyResponse<MessageV1Field<ZaloMessageType>> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetLastMessage-main)',
        };

        const result = await getMessageWithId(id);

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

export default Handle_GetMessageWithId;
