import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomPhoneField } from '@src/dataStruct/chatRoom';
import { CreateChatRoomPhoneBodyField } from '@src/dataStruct/chatRoom/body';
import { verifyRefreshToken } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';
import MutateDB_CreateChatRoomPhone from '../../mutateDB/CreateChatRoomPhone';

class Handle_CreateChatRoomPhone {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, CreateChatRoomPhoneBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<ChatRoomPhoneField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_CreateChatRoomPhone-setup) !',
        };

        const createChatRoomPhoneBody = req.body;
        // const { refreshToken } = req.cookies;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verifyRefreshToken(refreshToken);

            if (verify_refreshToken === 'invalid') {
                myResponse.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            if (verify_refreshToken === 'expired') {
                myResponse.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            const { id } = verify_refreshToken;
            createChatRoomPhoneBody.accountId = id;
            res.locals.createChatRoomPhoneBody = createChatRoomPhoneBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const createChatRoomPhoneBody = res.locals.createChatRoomPhoneBody as CreateChatRoomPhoneBodyField;

        const myResponse: MyResponse<ChatRoomPhoneField> = {
            isSuccess: false,
            message: 'Bắt đầu tạo (Handle_CreateChatRoomPhone-main) !',
        };

        const mutateDB = new MutateDB_CreateChatRoomPhone();
        mutateDB.setCreateChatRoomPhoneBody(createChatRoomPhoneBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const rData = result.recordset[0];
                const data = rData;
                myResponse.message = 'Tạo ChatRoomPhone thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo ChatRoomPhone KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            console.error(error);
            myResponse.message = 'Tạo ChatRoomPhone KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateChatRoomPhone;
