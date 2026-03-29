import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import { ChatRoomRoleWithCridAaidBodyField } from '@src/dataStruct/chatRoom/body';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { getLastMessage } from '../../queryMongo/GetLastMessage';
import { verifyRefreshToken } from '@src/token';
import { prefix_cache_chatRoomRole } from '@src/const/redisKey/chatRoom';
import QueryDB_GetChatRoomRoleWithCridAaid from '../../queryDB/GetChatRoomRoleWithCridAaid';

class Handle_GetLastMessage {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = (req: Request<any, any, any, { chatRoomId: string }>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<MessageV1Field<ZaloMessageType>> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetLastMessage-setup)',
        };

        const chatRoomId = req.query.chatRoomId;
        const chatRoomRoleWithCridAaidBody: ChatRoomRoleWithCridAaidBodyField = {
            chatRoomId: Number(chatRoomId),
            authorizedAccountId: -1,
        };
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
            const chatRoomRoleWithCridAaidBody_cp = { ...chatRoomRoleWithCridAaidBody };
            chatRoomRoleWithCridAaidBody_cp.authorizedAccountId = id;
            res.locals.chatRoomRoleWithCridAaidBody = chatRoomRoleWithCridAaidBody_cp;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    getRole = async (_: Request, res: Response, next: NextFunction) => {
        const chatRoomRoleWithCridAaidBody = res.locals
            .chatRoomRoleWithCridAaidBody as ChatRoomRoleWithCridAaidBodyField;
        const crid = chatRoomRoleWithCridAaidBody.chatRoomId;
        const aaid = chatRoomRoleWithCridAaidBody.authorizedAccountId;

        const myResponse: MyResponse<MessageV1Field<ZaloMessageType>> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetLastMessage-getRole)',
        };

        const keyRedis = `${prefix_cache_chatRoomRole.key.with_crid_Aaid}_${crid}_${aaid}`;
        const timeExpireat = prefix_cache_chatRoomRole.time;

        const chatRoomRole_redis = await this._serviceRedis.getData<ChatRoomRoleField>(keyRedis);
        if (chatRoomRole_redis) {
            res.locals.chatRoomRole = chatRoomRole_redis;
            next();
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
                res.locals.chatRoomRole = rData;
                next();
                return;
            } else {
                myResponse.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    isPassRole = async (_: Request, res: Response, next: NextFunction) => {
        const chatRoomRole = res.locals.chatRoomRole as ChatRoomRoleField;

        const myResponse: MyResponse<ChatRoomRoleField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetLastMessage-isPassRole)',
        };

        const isRead = chatRoomRole.isRead;
        const isSend = chatRoomRole.isSend;

        if (isSend || isRead) {
            next();
            return;
        } else {
            myResponse.message = 'Bạn không có quyền xem nội dung này !';
            res.status(200).json(myResponse);
            return;
        }
    };

    main = async (req: Request<any, any, any, { chatRoomId: string }>, res: Response) => {
        const chatRoomId = req.query.chatRoomId;

        const myResponse: MyResponse<MessageV1Field<ZaloMessageType>> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetLastMessage-main)',
        };

        const result = await getLastMessage(Number(chatRoomId));

        if (result) {
            myResponse.data = result;
            myResponse.message = 'Lấy tin nhắn cuối cùng thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        } else {
            myResponse.message = 'Lấy tin nhắn cuối cùng KHÔNG thành công !';
            res.status(200).json(myResponse);
            return;
        }
    };
}

export default Handle_GetLastMessage;
