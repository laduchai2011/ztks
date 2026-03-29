import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { GetChatRoomWithIdBodyField } from '@src/dataStruct/chatRoom/body';
import QueryDB_GetChatRoomWithId from '../../queryDB/GetChatRoomWithId';
import { prefix_cache_chatRoom_with_id } from '@src/const/redisKey/chatRoom';

const timeExpireat = 60 * 5; // 5p

class Handle_GetChatRoomWithId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    main = async (req: Request<Record<string, never>, unknown, GetChatRoomWithIdBodyField>, res: Response) => {
        const getChatRoomWithIdBody = req.body;

        const myResponse: MyResponse<ChatRoomField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetChatRoomWithId-main)',
        };

        // get in redis
        const id = getChatRoomWithIdBody.id;
        const keyRedis = `${prefix_cache_chatRoom_with_id}_${id}`;
        const chatRoom = await this._serviceRedis.getData<ChatRoomField>(keyRedis);
        if (chatRoom) {
            myResponse.data = chatRoom;
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

                // cache into redis
                const isSet = this._serviceRedis.setData<ChatRoomField>(keyRedis, r_chatRoom, timeExpireat);
                if (!isSet) {
                    console.error('Failed to lưu thông tin phòng hội thoại in Redis', keyRedis);
                }

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
