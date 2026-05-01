import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomField, PagedChatRoomField } from '@src/dataStruct/chatRoom';
import { GetMyChatRoomsBodyField } from '@src/dataStruct/chatRoom/body';
import QueryDB_GetMyChatRooms from '../../queryDB/GetMyChatRooms';

class Handle_GetMyChatRooms {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetMyChatRoomsBodyField>, res: Response) => {
        const getMyChatRoomsBody = req.body;

        const myResponse: MyResponse<PagedChatRoomField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetMyChatRooms-main)',
        };

        const queryDB = new QueryDB_GetMyChatRooms();
        queryDB.setGetMyChatRoomsBody(getMyChatRoomsBody);

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
                const rows: ChatRoomField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy những phòng hội thoại thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những phòng hội thoại KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những phòng hội thoại KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetMyChatRooms;
