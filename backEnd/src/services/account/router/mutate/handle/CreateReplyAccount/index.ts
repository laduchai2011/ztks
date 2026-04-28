import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountField } from '@src/dataStruct/account';
import {
    CreateReplyAccountBodyField,
    GetNotReplyAccountBodyField,
    GetReplyAccountBodyField,
} from '@src/dataStruct/account/body';
import { ChatRoomRoleSchema, ChatRoomField } from '@src/dataStruct/chatRoom';
import { ChatRoomRoleZodSchema } from '@src/schema/chatRoom';
import { ChatRoomRoleSchemaType } from '@src/schema/chatRoom';
import { GetChatRoomWithIdBodyField } from '@src/dataStruct/chatRoom/body';
import { getDbMonggo } from '@src/connect/mongo';
import MutateDB_CreateReplyAccount from '../../mutateDB/CreateReplyAccount';
import QueryDB_GetChatRoomWithId from '@src/services/chatRoom/router/query/queryDB/GetChatRoomWithId';
import { verifyRefreshToken } from '@src/token';
import { prefix_cache_notReplyAccounts, prefix_cache_replyAccounts } from '@src/const/redisKey/account';
import { CacheGetChatRoomWithId } from '@src/const/redisKey/chatRoom';

// const timeExpireat = 60 * 5; // 5p

class Handle_CreateReplyAccount {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _cacheGetChatRoomWithId = new CacheGetChatRoomWithId();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
        this._cacheGetChatRoomWithId.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, CreateReplyAccountBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_CreateReplyAccount-setup) !',
        };

        const createReplyAccountBody = req.body;
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
            if (createReplyAccountBody.accountId === id) {
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

    getZaloOaId = async (
        req: Request<Record<string, never>, unknown, CreateReplyAccountBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const chatRoomId = req.body.chatRoomId;

        const getChatRoomWithIdBody: GetChatRoomWithIdBodyField = { id: chatRoomId };
        this._cacheGetChatRoomWithId.setBody(getChatRoomWithIdBody);

        const myResponse: MyResponse<ChatRoomField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateReplyAccount-getZaloOaId)',
        };

        // get in redis
        // const id = getChatRoomWithIdBody.id;
        // const keyRedis = `${prefix_cache_chatRoom_with_id}_${id}`;
        // const chatRoom = await this._serviceRedis.getData<ChatRoomField>(keyRedis);
        const chatRoom_cache = await this._cacheGetChatRoomWithId.getData();
        if (chatRoom_cache) {
            res.locals.zaloOaId = chatRoom_cache.zaloOaId;
            next();
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

                // // cache into redis
                // const isSet = this._serviceRedis.setData<ChatRoomField>(keyRedis, r_chatRoom, timeExpireat);
                // if (!isSet) {
                //     console.error('Failed to lưu thông tin phòng hội thoại in Redis', keyRedis);
                // }

                this._cacheGetChatRoomWithId.setData(r_chatRoom);

                res.locals.zaloOaId = r_chatRoom.zaloOaId;
                next();
                return;
            } else {
                myResponse.message = 'Lấy phòng chat KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy phòng chat KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (req: Request<Record<string, never>, unknown, CreateReplyAccountBodyField>, res: Response) => {
        const createReplyAccountBody = req.body;
        const chatRoomId = createReplyAccountBody.chatRoomId;
        const zaloOaId = res.locals.zaloOaId as number;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
            message: 'Băt đầu cập nhật (Handle_CreateReplyAccount-main) !',
        };

        const mutateDB = new MutateDB_CreateReplyAccount();
        mutateDB.setCreateReplyAccountBody(createReplyAccountBody);

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
                rData.password = '';
                rData.phone = '';

                // delete cache notReplyAccount
                const keyMaxPageRedis_n = `${prefix_cache_notReplyAccounts.key.maxPage_with_chatRoomId}_${chatRoomId}`;
                const keyBodyRedis_n = `${prefix_cache_notReplyAccounts.key.body_with_chatRoomId}_${chatRoomId}`;
                const maxPage_n = await this._serviceRedis.getData<number>(keyMaxPageRedis_n);
                const rBody_n = await this._serviceRedis.getData<GetNotReplyAccountBodyField>(keyBodyRedis_n);
                if (maxPage_n && rBody_n) {
                    const size_n = rBody_n.size;
                    for (let i: number = 0; i < maxPage_n; i++) {
                        const keyDataRedis_n = `${prefix_cache_notReplyAccounts.key.with_chatRoomId}_${chatRoomId}_${i + 1}_${size_n}`;
                        this._serviceRedis.deleteData(keyDataRedis_n);
                        this._serviceRedis.deleteData(keyBodyRedis_n);
                        this._serviceRedis.deleteData(keyMaxPageRedis_n);
                    }
                }

                // delete cache replyAccount
                const keyMaxPageRedis = `${prefix_cache_replyAccounts.key.maxPage_with_chatRoomId}_${chatRoomId}`;
                const keyBodyRedis = `${prefix_cache_replyAccounts.key.body_with_chatRoomId}_${chatRoomId}`;
                const maxPage = await this._serviceRedis.getData<number>(keyMaxPageRedis);
                const rBody = await this._serviceRedis.getData<GetReplyAccountBodyField>(keyBodyRedis);
                if (maxPage && rBody) {
                    const size = rBody.size;
                    for (let i: number = 0; i < maxPage; i++) {
                        const keyDataRedis = `${prefix_cache_replyAccounts.key.with_chatRoomId}_${chatRoomId}_${i + 1}_${size}`;
                        this._serviceRedis.deleteData(keyDataRedis);
                        this._serviceRedis.deleteData(keyBodyRedis);
                        this._serviceRedis.deleteData(keyMaxPageRedis);
                    }
                }

                // storge mongo
                const chatRommRoleSchema: ChatRoomRoleSchema = {
                    authorized_account_id: createReplyAccountBody.authorizedAccountId,
                    is_read: true,
                    is_send: false,
                    chat_room_id: chatRoomId,
                    zalo_oa_id: zaloOaId,
                    account_id: createReplyAccountBody.accountId,
                };
                await createChatRoomRoleMongo(chatRommRoleSchema);

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
            myResponse.message = 'Cập nhật KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

async function createChatRoomRoleMongo(chatRommRoleSchema: ChatRoomRoleSchema) {
    const parsedChatRoomRole = ChatRoomRoleZodSchema.safeParse(chatRommRoleSchema);
    if (!parsedChatRoomRole.success) {
        console.error('Invalid chatRoomRole format:', parsedChatRoomRole.error);
    } else {
        const dbMonggo = getDbMonggo();
        const dataParse = parsedChatRoomRole.data;
        await dbMonggo.collection<ChatRoomRoleSchemaType>('chatRoomRole').insertOne(dataParse);
    }
}

export default Handle_CreateReplyAccount;
