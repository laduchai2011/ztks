import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { NewMessageV1Field } from '@src/dataStruct/message_v1';
import { AllNewMessagesBodyField } from '@src/dataStruct/message_v1/body';
import { ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import { ChatRoomRoleWithCridAaidBodyField } from '@src/dataStruct/chatRoom/body';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';
import { getAllNewMessages } from '../../queryMongo/GetAllNewMessages';
import { verifyRefreshToken } from '@src/token';
import { CacheGetChatRoomRoleWithCridAaid } from '@src/const/redisKey/chatRoom';
import QueryDB_GetChatRoomRoleWithCridAaid from '../../queryDB/GetChatRoomRoleWithCridAaid';

class Handle_GetAllNewMessages {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _cacheGetChatRoomRoleWithCridAaid = new CacheGetChatRoomRoleWithCridAaid();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
        this._cacheGetChatRoomRoleWithCridAaid.init();
    }

    setup = (req: Request<any, any, any, { chatRoomId: string }>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<NewMessageV1Field<ZaloMessageType>[]> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAllNewMessages-setup)',
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
            res.locals.myAccountId = id;
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

        this._cacheGetChatRoomRoleWithCridAaid.setBody({ chatRoomId: crid, authorizedAccountId: aaid });

        const myResponse: MyResponse<NewMessageV1Field<ZaloMessageType>> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAllNewMessages-getRole)',
        };

        const chatRoomRole_cache = await this._cacheGetChatRoomRoleWithCridAaid.getData();
        if (chatRoomRole_cache) {
            res.locals.chatRoomRole = chatRoomRole_cache;
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

                this._cacheGetChatRoomRoleWithCridAaid.setData(rData);

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
            message: 'Bắt đầu (Handle_GetAllNewMessages-isPassRole)',
        };

        const isRead = chatRoomRole.isRead;
        // const isSend = chatRoomRole.isSend;

        if (isRead) {
            next();
            return;
        } else {
            myResponse.message = 'Bạn không có quyền xem nội dung này !';
            res.status(200).json(myResponse);
            return;
        }
    };

    main = async (req: Request<any, any, any, { chatRoomId: string }>, res: Response) => {
        const chatRoomId = Number(req.query.chatRoomId) || -1;
        const myAccountId = res.locals.myAccountId as number;

        const allNewMessagesBody: AllNewMessagesBodyField = {
            chatRoomId: chatRoomId,
            accountId: myAccountId,
        };

        const myResponse: MyResponse<NewMessageV1Field<ZaloMessageType>[]> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAllNewMessages-main)',
        };

        const result = await getAllNewMessages(allNewMessagesBody);

        if (result) {
            myResponse.data = result;
            myResponse.message = 'Lấy tất cả tin nhắn mới thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        } else {
            myResponse.message = 'Lấy tất cả tin nhắn mới KHÔNG thành công !';
            res.status(200).json(myResponse);
            return;
        }
    };
}

export default Handle_GetAllNewMessages;
