import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { ChatRoomField, ChatRoomRoleSchema } from '@src/dataStruct/chatRoom';
import { ChangeChatRoomMasterBodyField } from '@src/dataStruct/chatRoom/body';
import MutateDB_ChangeChatRoomMaster from '../../mutateDB/ChangeChatRoomMaster';
import { verifyRefreshToken } from '@src/token';
import { getDbMonggo } from '@src/connect/mongo';
import {
    CacheGetChatRoomWithId,
    CacheGetChatRoomRoleWithCridAaid,
    CacheGetAllChatRoomRoleWithCrid,
    CacheGetChatRoomWithZaloOaIdUserIdByApp,
} from '@src/const/redisKey/chatRoom';
import { ChatRoomRoleZodSchema, ChatRoomRoleSchemaType } from '@src/schema/chatRoom';

class Handle_ChangeChatRoomMaster {
    private _mssql_server = mssql_server;
    private _cacheGetChatRoomWithId = new CacheGetChatRoomWithId({ logPrameter: 'Handle_ChangeChatRoomMaster' });
    private _cacheGetChatRoomRoleWithCridAaid = new CacheGetChatRoomRoleWithCridAaid();
    private _cacheGetAllChatRoomRoleWithCrid = new CacheGetAllChatRoomRoleWithCrid();
    private _cacheGetChatRoomWithZaloOaIdUserIdByApp = new CacheGetChatRoomWithZaloOaIdUserIdByApp();

    constructor() {
        this._mssql_server.init();
        this._cacheGetChatRoomWithId.init();
        this._cacheGetChatRoomRoleWithCridAaid.init();
        this._cacheGetAllChatRoomRoleWithCrid.init();
        this._cacheGetChatRoomWithZaloOaIdUserIdByApp.init();
    }

    setup = async (req: Request<any, any, ChangeChatRoomMasterBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<ChatRoomField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_ChangeChatRoomMaster-setup) !',
        };

        const changeChatRoomMasterBody = req.body;
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
            changeChatRoomMasterBody.accountId = id;
            res.locals.changeChatRoomMasterBody = changeChatRoomMasterBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const changeChatRoomMasterBody = res.locals.changeChatRoomMasterBody as ChangeChatRoomMasterBodyField;

        const myResponse: MyResponse<ChatRoomField> = {
            isSuccess: false,
            message: 'Bắt đầu cập nhật (Handle_ChangeChatRoomMaster-main) !',
        };

        const mutateDB = new MutateDB_ChangeChatRoomMaster();
        mutateDB.setChangeChatRoomMasterBody(changeChatRoomMasterBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const rData = result.recordset[0];

                this._cacheGetChatRoomWithId.setBody({ id: rData.id });
                await this._cacheGetChatRoomWithId.clearCache();

                this._cacheGetChatRoomRoleWithCridAaid.setFkCrid(rData.id);
                await this._cacheGetChatRoomRoleWithCridAaid.clearCacheWithFkCrid();

                this._cacheGetAllChatRoomRoleWithCrid.setBody({ chatRoomId: rData.id });
                await this._cacheGetAllChatRoomRoleWithCrid.clearCache();

                this._cacheGetChatRoomWithZaloOaIdUserIdByApp.setBody({
                    zaloOaId: rData.zaloOaId,
                    userIdByApp: rData.userIdByApp,
                });
                await this._cacheGetChatRoomWithZaloOaIdUserIdByApp.clearCache();

                await clearMongo(changeChatRoomMasterBody.chatRoomId, changeChatRoomMasterBody.accountId);

                await createChatRoomRoleMongo(rData, rData.zaloOaId);

                const data = rData;
                myResponse.message = 'Cập nhật thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Cập nhật KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            console.error(error);
            myResponse.message = 'Cập nhật KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

async function clearMongo(chat_room_id: number, accountId: number) {
    const db = getDbMonggo();
    const col_chatRoomRole = db.collection('chatRoomRole');
    const col_newMessage = db.collection('newMessage');

    await col_chatRoomRole.deleteMany({
        chat_room_id: chat_room_id,
        account_id: accountId,
    });

    await col_newMessage.deleteMany({
        account_id: accountId,
    });
}

async function createChatRoomRoleMongo(chatRoom: ChatRoomField, zaloOaId: number) {
    const chatRommRoleSchema: ChatRoomRoleSchema = {
        authorized_account_id: chatRoom.accountId,
        is_read: true,
        is_send: true,
        chat_room_id: chatRoom.id,
        zalo_oa_id: zaloOaId,
        account_id: chatRoom.accountId,
    };
    const parsedChatRoomRole = ChatRoomRoleZodSchema.safeParse(chatRommRoleSchema);
    if (!parsedChatRoomRole.success) {
        console.error('Invalid chatRoomRole format:', parsedChatRoomRole.error);
    } else {
        const dbMonggo = getDbMonggo();
        const dataParse = parsedChatRoomRole.data;
        await dbMonggo.collection<ChatRoomRoleSchemaType>('chatRoomRole').insertOne(dataParse);
    }
}

export default Handle_ChangeChatRoomMaster;
