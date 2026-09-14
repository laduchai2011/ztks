import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PagedChatRoomMongoField } from '@src/dataStruct/chatRoom';
import { ChatRoomsMongoBodyField } from '@src/dataStruct/chatRoom/body';
import { getChatRoomsMongo } from '../../queryMongo/GetChatRooms';

class Handle_GetChatRoomsMongo {
    constructor() {}

    main = async (req: Request<Record<string, never>, unknown, ChatRoomsMongoBodyField>, res: Response) => {
        const chatRoomsMongoBody = req.body;

        const myResponse: MyResponse<PagedChatRoomMongoField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetChatRoomsMongo-main)',
        };

        const result = await getChatRoomsMongo(chatRoomsMongoBody);
        myResponse.data = result;
        myResponse.message = 'Lấy danh sách phòng chat thành công !';
        myResponse.isSuccess = true;
        res.status(200).json(myResponse);
        return;
    };
}

export default Handle_GetChatRoomsMongo;
