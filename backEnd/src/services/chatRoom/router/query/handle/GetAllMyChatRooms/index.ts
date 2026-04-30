import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { GetAllMyChatRoomsBodyField } from '@src/dataStruct/chatRoom/body';
import QueryDB_GetAllMyChatRooms from '../../queryDB/GetAllMyChatRooms';
import { verifyRefreshToken } from '@src/token';

class Handle_GetAllMyChatRooms {
    private _mssql_server = mssql_server;

    constructor() {}

    setup = (req: Request<any, any, GetAllMyChatRoomsBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<ChatRoomField[]> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAllMyChatRooms-setup)',
        };

        const getAllMyChatRoomsBody = req.body;
        const { refreshToken } = req.cookies;

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
            getAllMyChatRoomsBody.accountId = id;
            res.locals.getAllMyChatRoomsBody = getAllMyChatRoomsBody;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getAllMyChatRoomsBody = res.locals.getAllMyChatRoomsBody as GetAllMyChatRoomsBodyField;

        const myResponse: MyResponse<ChatRoomField[]> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAllMyChatRooms-main)',
        };

        await this._mssql_server.init();

        const queryDB = new QueryDB_GetAllMyChatRooms();
        queryDB.setGetAllMyChatRoomsBody(getAllMyChatRoomsBody);

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
                myResponse.data = result?.recordset;
                myResponse.message = 'Lấy tất cả phòng hội thoại của tôi thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy tất cả phòng hội thoại của tôi KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy tất cả phòng hội thoại của tôi KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetAllMyChatRooms;
