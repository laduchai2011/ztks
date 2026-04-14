import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import { ChatRoomRoleWithCridAaidBodyField } from '@src/dataStruct/chatRoom/body';
import QueryDB_GetChatRoomRoleWithCridAaid from '../../qmdb/queryDB/GetChatRoomRoleWithCridAaid';
import { prefix_cache_chatRoomRole } from '@src/const/redisKey/chatRoom';

class Handle_GetChatRoomRoleWithCridAaid {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _chatRoomRole: ChatRoomRoleField | undefined;
    private _chatRoomRoleWithCridAaidBody: ChatRoomRoleWithCridAaidBodyField | undefined;

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = (chatRoomRole: ChatRoomRoleField, chatRoomRoleWithCridAaidBody: ChatRoomRoleWithCridAaidBodyField) => {
        this._chatRoomRole = chatRoomRole;
        this._chatRoomRoleWithCridAaidBody = chatRoomRoleWithCridAaidBody;
    };

    main = async () => {
        if (!this._chatRoomRoleWithCridAaidBody) {
            console.error('Thiết lập thất bại !');
            return;
        }

        const crid = this._chatRoomRoleWithCridAaidBody.chatRoomId;
        const aaid = this._chatRoomRoleWithCridAaidBody.authorizedAccountId;

        const keyRedis = `${prefix_cache_chatRoomRole.key.with_crid_Aaid}_${crid}_${aaid}`;
        const timeExpireat = prefix_cache_chatRoomRole.time;

        const chatRoomRole_redis = await this._serviceRedis.getData<ChatRoomRoleField>(keyRedis);
        if (chatRoomRole_redis) {
            return chatRoomRole_redis;
        }

        const queryDB = new QueryDB_GetChatRoomRoleWithCridAaid();
        queryDB.setChatRoomRoleWithCridAaidBody(this._chatRoomRoleWithCridAaidBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const rData: ChatRoomRoleField = result.recordset[0];
                const isSet = await this._serviceRedis.setData<ChatRoomRoleField>(keyRedis, rData, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set thông tin quyền truy cập phòng hội thoại in Redis', keyRedis);
                }

                return rData;
            } else {
                console.error('Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công !');
                return;
            }
        } catch (error) {
            console.error('Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công !!', error);
            return;
        }
    };

    passRole = async () => {
        if (!this._chatRoomRole) {
            console.error('Thiết lập thất bại !');
            return false;
        }

        const isSend = this._chatRoomRole.isSend;

        if (isSend) {
            return true;
        } else {
            console.error('Bạn không có quyền này !');
            return false;
        }
    };
}

export default Handle_GetChatRoomRoleWithCridAaid;
