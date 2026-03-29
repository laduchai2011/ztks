import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import QueryDB_GetMemberReceiveMessage from '../../queryDB/GetMemberReceiveMessage';
import { AccountField } from '@src/dataStruct/account';
import { MyResponse } from '@src/dataStruct/response';

class Handle_GetMemberReceiveMessage {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (_: Request, res: Response) => {
        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        await this._mssql_server.init();

        const queryDB_getMemberReceiveMessage = new QueryDB_GetMemberReceiveMessage();

        try {
            const result = await queryDB_getMemberReceiveMessage.run();
            if (result) {
                myResponse.message = 'Lấy thành viên nhận tin nhắn thành công !';
                myResponse.isSuccess = true;
                myResponse.data = result;
                res.json(myResponse);
            } else {
                myResponse.message = 'Lấy thành viên nhận tin nhắn KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
            }
        } catch (error) {
            myResponse.message = 'Lấy thành viên nhận tin nhắn thất bại 2 !';
            myResponse.err = error;
            res.status(200).json(myResponse);
        }
    };
}

export default Handle_GetMemberReceiveMessage;
