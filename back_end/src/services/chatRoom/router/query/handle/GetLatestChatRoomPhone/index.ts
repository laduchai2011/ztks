import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomPhoneField } from '@src/dataStruct/chatRoom';
import { GetLatestChatRoomPhoneBodyField } from '@src/dataStruct/chatRoom/body';
import QueryDB_GetLatestChatRoomPhone from '../../queryDB/GetLatestChatRoomPhone';
import { verifyRefreshToken } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_GetLatestChatRoomPhone {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, GetLatestChatRoomPhoneBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<ChatRoomPhoneField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_GetLatestChatRoomPhone-setup) !',
        };

        const getLatestChatRoomPhoneBody = req.body;
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
            getLatestChatRoomPhoneBody.accountId = id;
            res.locals.getLatestChatRoomPhoneBody = getLatestChatRoomPhoneBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getLatestChatRoomPhoneBody = res.locals.getLatestChatRoomPhoneBody as GetLatestChatRoomPhoneBodyField;

        const myResponse: MyResponse<ChatRoomPhoneField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetLatestChatRoomPhone-main)',
        };

        const queryDB = new QueryDB_GetLatestChatRoomPhone();
        queryDB.setGetLatestChatRoomPhoneBody(getLatestChatRoomPhoneBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const r_chatRoom = result.recordset[0];
                myResponse.data = r_chatRoom;
                myResponse.message = 'Lấy số điện thoại mới nhất của phòng chat thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy số điện thoại mới nhất của phòng chat KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy số điện thoại mới nhất của phòng chat KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetLatestChatRoomPhone;
