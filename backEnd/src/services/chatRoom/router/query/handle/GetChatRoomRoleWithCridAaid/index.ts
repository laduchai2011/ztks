import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import { ChatRoomRoleWithCridAaidBodyField } from '@src/dataStruct/chatRoom/body';
import QueryDB_GetChatRoomRoleWithCridAaid from '../../queryDB/GetChatRoomRoleWithCridAaid';
import { prefix_cache_chatRoomRole } from '@src/const/redisKey/chatRoom';

class Handle_GetChatRoomRoleWithCridAaid {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    main = async (req: Request<Record<string, never>, unknown, ChatRoomRoleWithCridAaidBodyField>, res: Response) => {
        const chatRoomRoleWithCridAaidBody = req.body;
        const crid = chatRoomRoleWithCridAaidBody.chatRoomId;
        const aaid = chatRoomRoleWithCridAaidBody.authorizedAccountId;

        const myResponse: MyResponse<ChatRoomRoleField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetChatRoomRoleWithCridAaid-main)',
        };

        const keyRedis = `${prefix_cache_chatRoomRole.key.with_crid_Aaid}_${crid}_${aaid}`;
        const timeExpireat = prefix_cache_chatRoomRole.time;

        const chatRoomRole_redis = await this._serviceRedis.getData<ChatRoomRoleField>(keyRedis);
        if (chatRoomRole_redis) {
            myResponse.data = chatRoomRole_redis;
            myResponse.message = 'Lấy thông tin quyền truy cập phòng hội thoại thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetChatRoomRoleWithCridAaid();
        queryDB.setChatRoomRoleWithCridAaidBody(chatRoomRoleWithCridAaidBody);

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
                const rData = result.recordset[0];
                const isSet = await this._serviceRedis.setData<ChatRoomRoleField>(keyRedis, rData, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set thông tin quyền truy cập phòng hội thoại in Redis', keyRedis);
                }

                myResponse.data = rData;
                myResponse.message = 'Lấy thông tin quyền truy cập phòng hội thoại thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetChatRoomRoleWithCridAaid;
