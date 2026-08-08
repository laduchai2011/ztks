import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { getLastMessageWithUid } from '../../queryMongo/GetLastMessage';

class Handle_GetLastMessageWithUid {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, any, { uid: string }>, res: Response) => {
        const uid = req.query.uid;

        const myResponse: MyResponse<MessageV1Field<ZaloMessageType>> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetLastMessage-main)',
        };

        const result = await getLastMessageWithUid(uid);

        if (result) {
            myResponse.data = result;
            myResponse.message = 'Lấy tin nhắn cuối cùng thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        } else {
            myResponse.message = 'Lấy tin nhắn cuối cùng KHÔNG thành công !';
            res.status(200).json(myResponse);
            return;
        }
    };
}

export default Handle_GetLastMessageWithUid;
