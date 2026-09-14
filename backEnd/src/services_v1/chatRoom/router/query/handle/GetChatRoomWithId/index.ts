import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { GetChatRoomWithIdBodyField } from '@src/dataStruct/chatRoom/body';
import QueryDB_GetChatRoomWithId from '../../queryDB/GetChatRoomWithId';
import { CacheGetChatRoomWithId } from '@src/const/redisKey/chatRoom';

class Handle_GetChatRoomWithId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _cacheGetChatRoomWithId = new CacheGetChatRoomWithId({ logPrameter: 'Handle_GetChatRoomWithId' });

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
        this._cacheGetChatRoomWithId.init();
    }

    main = async (req: Request<Record<string, never>, unknown, GetChatRoomWithIdBodyField>, res: Response) => {
        const getChatRoomWithIdBody = req.body;

        this._cacheGetChatRoomWithId.setBody({ id: getChatRoomWithIdBody.id });

        const myResponse: MyResponse<ChatRoomField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetChatRoomWithId-main)',
        };

        const chatRoom_cache = await this._cacheGetChatRoomWithId.getData();
        if (chatRoom_cache) {
            myResponse.data = chatRoom_cache;
            myResponse.message = 'Lấy phòng chat thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetChatRoomWithId();
        queryDB.setGetChatRoomWithIdBody(getChatRoomWithIdBody);

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

                this._cacheGetChatRoomWithId.setData(r_chatRoom);

                myResponse.data = r_chatRoom;
                myResponse.message = 'Lấy phòng chat thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy phòng chat KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy phòng chat KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetChatRoomWithId;
