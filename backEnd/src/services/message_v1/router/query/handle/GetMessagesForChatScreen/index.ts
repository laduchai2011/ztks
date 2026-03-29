import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PagedMessageV1Field } from '@src/dataStruct/message_v1';
import { MessageV1BodyField } from '@src/dataStruct/message_v1/body';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { getMessagesFirst, getMessagesMore } from '../../queryMongo/GetMessageForChatScreen';

class Handle_GetMessagesForChatScreen {
    constructor() {}

    main = async (req: Request<Record<string, never>, unknown, MessageV1BodyField>, res: Response) => {
        const messageV1Body = req.body;
        const chatRoomId = messageV1Body.chatRoomId;
        const limit = messageV1Body.size;
        const cursor = messageV1Body.cursor;
        let result: PagedMessageV1Field<ZaloMessageType> | null = null;

        const myResponse: MyResponse<PagedMessageV1Field<ZaloMessageType>> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetChatRoomRoleWithCridAaid-main)',
        };

        if (!cursor) {
            result = await getMessagesFirst(chatRoomId, limit);
        } else {
            result = await getMessagesMore(chatRoomId, cursor, limit);
        }

        if (result) {
            myResponse.data = result;
            myResponse.message = 'Lấy tin nhắn phòng hội thoại thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        } else {
            myResponse.message = 'Lấy tin nhắn phòng hội thoại KHÔNG thành công !';
            res.status(200).json(myResponse);
            return;
        }
    };
}

export default Handle_GetMessagesForChatScreen;
