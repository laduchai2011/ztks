import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomPhoneField, PagedChatRoomPhoneField } from '@src/dataStruct/chatRoom';
import { GetListChatRoomPhonesBodyField } from '@src/dataStruct/chatRoom/body';
import QueryDB_GetListChatRoomPhones from '../../queryDB/GetListChatRoomPhones';
import { verifyRefreshToken } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_GetListChatRoomPhones {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, GetListChatRoomPhonesBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<ChatRoomPhoneField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_GetListChatRoomPhones-setup) !',
        };

        const getListChatRoomPhonesBody = req.body;
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
            getListChatRoomPhonesBody.accountId = id;
            res.locals.getListChatRoomPhonesBody = getListChatRoomPhonesBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getListChatRoomPhonesBody = res.locals.getListChatRoomPhonesBody as GetListChatRoomPhonesBodyField;

        const myResponse: MyResponse<PagedChatRoomPhoneField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetListChatRoomPhones-main)',
        };

        const queryDB = new QueryDB_GetListChatRoomPhones();
        queryDB.setGetListChatRoomPhonesBody(getListChatRoomPhonesBody);

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
            if (result?.recordset) {
                const rows: ChatRoomPhoneField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy những số điện thoại phòng hội thoại thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những số điện thoại phòng hội thoại KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những số điện thoại phòng hội thoại KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetListChatRoomPhones;
