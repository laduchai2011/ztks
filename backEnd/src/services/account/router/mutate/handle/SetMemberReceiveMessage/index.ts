import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import MutateDB_SetMemberReceiveMessage from '../../mutateDB/SetMemberReceiveMessage';
import { AccountField } from '@src/dataStruct/account';
import { MyResponse } from '@src/dataStruct/response';

class Handle_SetMemberReceiveMessage {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<Record<string, never>, unknown, AccountField>, res: Response) => {
        const account = req.body;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        await this._mssql_server.init();

        const mutateDB_setMemberReceiveMessage = new MutateDB_SetMemberReceiveMessage();

        try {
            mutateDB_setMemberReceiveMessage.setMember(account);
            const result = await mutateDB_setMemberReceiveMessage.run();
            if (result) {
                myResponse.message = 'Thiết lập thành viên nhận tin nhắn thành công !';
                myResponse.isSuccess = true;
                myResponse.data = result;
                res.json(myResponse);
            } else {
                myResponse.message = 'Thiết lập thành viên nhận tin nhắn KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
            }
        } catch (error) {
            myResponse.message = 'Thiết lập thành viên nhận tin nhắn thất bại 2 !';
            myResponse.err = error;
            res.status(200).json(myResponse);
        }
    };
}

export default Handle_SetMemberReceiveMessage;
