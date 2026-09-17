import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Account_Field } from '@src/dataStruct/account';
import {
    Create_Reply_Account_Body_Field,
    Get_Not_Reply_Account_Body_Field,
    Get_Reply_Account_Body_Field,
} from '@src/dataStruct/account/body';
import { Chat_Room_Role_Schema, Chat_Room_Field } from '@src/datastruct/chat_room';
import { Get_Chat_Room_With_Id_Body_Field } from '@src/datastruct/chat_room/body';
import { Chat_Room_Role_Zod_Schema } from '@src/schema/chatRoom';
import { Chat_Room_Role_Schema_Type } from '@src/schema/chatRoom';
import { getDbMonggo } from '@src/connect/mongo';
import MutateDB_Create_Reply_Account from '../../mutateDB/Create_Reply_Account';
import QueryDB_Get_Chat_Room_With_Id from '@src/services/chatRoom/router/query/queryDB/Get_Chat_Room_With_Id';
import { verify_refresh_token } from '@src/token';
import { prefix_cache__not_reply_accounts, prefix_cache__reply_accounts } from '@src/const/redisKey/account';
import { Cache_Get_Chat_Room_With_Id } from '@src/const/redisKey/chat_room';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Reply_Account {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _cache_get_chat_room_with_id = new Cache_Get_Chat_Room_With_Id({ log_prameter: 'Handle_CreateReplyAccount' });

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
        this._cache_get_chat_room_with_id.init();
    }

    setup = async (
        req: Request<any, any, Create_Reply_Account_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Create_Reply_Account-setup) !',
        };

        const create_Reply_account_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_refresh_token(refreshToken);

            if (verify_refreshToken === 'invalid') {
                my_response.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            if (verify_refreshToken === 'expired') {
                my_response.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            const { id } = verify_refreshToken;
            if (create_Reply_account_body.account_id === id) {
                next();
            } else {
                my_response.message = 'Bạn không có quyền này !';
                res.status(200).json(my_response);
                return;
            }
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    get_Zalo_Oa_Id = async (
        req: Request<any, any, Create_Reply_Account_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const chat_room_id = req.body.chat_room_id;

        const get_chat_room_with_id_body: Get_Chat_Room_With_Id_Body_Field = { id: chat_room_id };
        this._cache_get_chat_room_with_id.set_Body(get_chat_room_with_id_body);

        const my_response: My_Response_Field<Chat_Room_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Reply_Account-getZaloOaId)',
        };

        const chat_room_cache = await this._cache_get_chat_room_with_id.get_Data();
        if (chat_room_cache) {
            res.locals.zalo_oa_id = chat_room_cache.zalo_oa_id;
            next();
            return;
        }

        const queryDB = new QueryDB_Get_Chat_Room_With_Id();
        queryDB.set_Get_Chat_Room_With_Id_Body(get_chat_room_with_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const r_chatRoom = result;

                this._cache_get_chat_room_with_id.set_Data(r_chatRoom);

                res.locals.zalo_oa_id = r_chatRoom.zalo_oa_id;
                next();
                return;
            } else {
                my_response.message = 'Lấy phòng chat KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy phòng chat KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (req: Request<any, any, Create_Reply_Account_Body_Field>, res: Response) => {
        const create_reply_account_body = req.body;
        const chat_room_id = create_reply_account_body.chat_room_id;
        const zalo_oa_id = res.locals.zalo_oa_id as string;

        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
            message: 'Băt đầu cập nhật (Handle_Create_Reply_Account-main) !',
        };

        const mutateDB = new MutateDB_Create_Reply_Account();
        mutateDB.set_Create_Reply_Account_Body(create_reply_account_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                const rData = result;
                rData.password = '';
                rData.phone = '';

                // delete cache notReplyAccount
                const keyMaxPageRedis_n = `${prefix_cache__not_reply_accounts.key.max_page_with_chat_room_id}_${chat_room_id}`;
                const keyBodyRedis_n = `${prefix_cache__not_reply_accounts.key.body_with_chat_room_id}_${chat_room_id}`;
                const maxPage_n = await this._serviceRedis.getData<number>(keyMaxPageRedis_n);
                const rBody_n = await this._serviceRedis.getData<Get_Not_Reply_Account_Body_Field>(keyBodyRedis_n);
                if (maxPage_n && rBody_n) {
                    const size_n = rBody_n.size;
                    for (let i: number = 0; i < maxPage_n; i++) {
                        const keyDataRedis_n = `${prefix_cache__not_reply_accounts.key.with_chat_room_id}_${chat_room_id}_${i + 1}_${size_n}`;
                        this._serviceRedis.deleteData(keyDataRedis_n);
                        this._serviceRedis.deleteData(keyBodyRedis_n);
                        this._serviceRedis.deleteData(keyMaxPageRedis_n);
                    }
                }

                // delete cache replyAccount
                const keyMaxPageRedis = `${prefix_cache__reply_accounts.key.max_page_with_chat_room_id}_${chat_room_id}`;
                const keyBodyRedis = `${prefix_cache__reply_accounts.key.body_with_chat_room_id}_${chat_room_id}`;
                const maxPage = await this._serviceRedis.getData<number>(keyMaxPageRedis);
                const rBody = await this._serviceRedis.getData<Get_Reply_Account_Body_Field>(keyBodyRedis);
                if (maxPage && rBody) {
                    const size = rBody.size;
                    for (let i: number = 0; i < maxPage; i++) {
                        const keyDataRedis = `${prefix_cache__reply_accounts.key.with_chat_room_id}_${chat_room_id}_${i + 1}_${size}`;
                        this._serviceRedis.deleteData(keyDataRedis);
                        this._serviceRedis.deleteData(keyBodyRedis);
                        this._serviceRedis.deleteData(keyMaxPageRedis);
                    }
                }

                // storge mongo
                const chat_romm_role_schema: Chat_Room_Role_Schema = {
                    authorized_account_id: create_reply_account_body.authorized_account_id,
                    is_read: true,
                    is_send: false,
                    chat_room_id: chat_room_id,
                    zalo_oa_id: zalo_oa_id,
                    account_id: create_reply_account_body.account_id,
                };
                await create_Chat_Room_Role_Mongo(chat_romm_role_schema);

                my_response.message = 'Cập nhật thành công !';
                my_response.is_success = true;
                my_response.data = rData;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Cập nhật KHÔNG thành công 1 !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Cập nhật KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

async function create_Chat_Room_Role_Mongo(chat_romm_role_schema: Chat_Room_Role_Schema) {
    const parsed_chat_room_role = Chat_Room_Role_Zod_Schema.safeParse(chat_romm_role_schema);
    if (!parsed_chat_room_role.success) {
        console.error('Invalid chat_room_role format:', parsed_chat_room_role.error);
    } else {
        const dbMonggo = getDbMonggo();
        const dataParse = parsed_chat_room_role.data;
        await dbMonggo.collection<Chat_Room_Role_Schema_Type>('chat_room_role').insertOne(dataParse);
    }
}

export default Handle_Create_Reply_Account;
