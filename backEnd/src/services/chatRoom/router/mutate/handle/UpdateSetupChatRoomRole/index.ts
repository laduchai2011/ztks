import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomRoleField, ChatRoomRoleSchema } from '@src/dataStruct/chatRoom';
import { UpdateSetupChatRoomRoleBodyField } from '@src/dataStruct/chatRoom/body';
import MutateDB_UpdateSetupChatRoomRole from '../../mutateDB/UpdateSetupChatRoomRole';
import { verifyRefreshToken } from '@src/token';
import { CacheGetChatRoomRoleWithCridAaid, CacheGetAllChatRoomRoleWithCrid } from '@src/const/redisKey/chatRoom';
import { ChatRoomRoleZodSchema } from '@src/schema/chatRoom';
// import { ChatRoomRoleSchemaType } from '@src/schema/chatRoom';
import { getDbMonggo } from '@src/connect/mongo';

class Handle_UpdateSetupChatRoomRole {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _cacheGetChatRoomRoleWithCridAaid = new CacheGetChatRoomRoleWithCridAaid();
    private _cacheGetAllChatRoomRoleWithCrid = new CacheGetAllChatRoomRoleWithCrid();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
        this._cacheGetChatRoomRoleWithCridAaid.init();
        this._cacheGetAllChatRoomRoleWithCrid.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, UpdateSetupChatRoomRoleBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<ChatRoomRoleField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_UpdateSetupChatRoomRole-setup) !',
        };

        const updateSetupChatRoomRoleBody = req.body;
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
            if (updateSetupChatRoomRoleBody.accountId === id) {
                next();
            } else {
                myResponse.message = 'Bạn không có quyền này !';
                res.status(200).json(myResponse);
                return;
            }
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (req: Request<Record<string, never>, unknown, UpdateSetupChatRoomRoleBodyField>, res: Response) => {
        const updateSetupChatRoomRoleBody = req.body;

        const myResponse: MyResponse<ChatRoomRoleField> = {
            isSuccess: false,
            message: 'Băt đầu cập nhật (Handle_UpdateSetupChatRoomRole-main) !',
        };

        const mutateDB = new MutateDB_UpdateSetupChatRoomRole();
        mutateDB.setUpdateSetupChatRoomRoleBody(updateSetupChatRoomRoleBody);

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

                await updateChatRoomRoleMongo(rData);

                const crid = rData.chatRoomId;
                const aaid = rData.authorizedAccountId;
                this._cacheGetChatRoomRoleWithCridAaid.setBody({ chatRoomId: crid, authorizedAccountId: aaid });
                this._cacheGetChatRoomRoleWithCridAaid.clearCache();

                this._cacheGetAllChatRoomRoleWithCrid.setBody({ chatRoomId: crid });
                this._cacheGetAllChatRoomRoleWithCrid.clearCache();

                const data = rData;
                myResponse.message = 'Cập nhật thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Cập nhật KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            console.error(error);
            myResponse.message = 'Cập nhật KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

async function updateChatRoomRoleMongo(chatRoomRole: ChatRoomRoleField) {
    const chatRommRoleSchema: ChatRoomRoleSchema = {
        authorized_account_id: chatRoomRole.authorizedAccountId,
        is_read: chatRoomRole.isRead,
        is_send: chatRoomRole.isSend,
        chat_room_id: chatRoomRole.chatRoomId,
        zalo_oa_id: -1,
        account_id: chatRoomRole.accountId,
    };

    const parsedChatRoomRole = ChatRoomRoleZodSchema.safeParse(chatRommRoleSchema);
    if (!parsedChatRoomRole.success) {
        console.error('Invalid chatRoomRole format:', parsedChatRoomRole.error);
    } else {
        const db = getDbMonggo();
        const dataParse = parsedChatRoomRole.data;
        const col = db.collection<ChatRoomRoleSchema>('chatRoomRole');

        const { zalo_oa_id, ...doc } = dataParse as any;

        await col.updateOne(
            {
                chat_room_id: chatRommRoleSchema.chat_room_id,
                authorized_account_id: chatRommRoleSchema.authorized_account_id,
            },
            { $set: doc },
            { upsert: true }
        );
    }
}

export default Handle_UpdateSetupChatRoomRole;
