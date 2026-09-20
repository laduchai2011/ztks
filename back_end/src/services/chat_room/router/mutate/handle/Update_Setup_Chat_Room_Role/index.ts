import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Chat_Room_Role_Field, Chat_Room_Role_Schema } from '@src/data_struct/chat_room';
import { Update_Setup_Chat_Room_Role_Body_Field } from '@src/data_struct/chat_room/body';
import MutateDB_Update_Setup_Chat_Room_Role from '../../mutateDB/Update_Setup_Chat_Room_Role';
import { verify_Refresh_Token } from '@src/token';
import {
    Cache_Get_Chat_Room_Role_With_Crid_Aaid,
    Cache_Get_All_Chat_Room_Role_With_Crid,
} from '@src/const/redisKey/chat_room';
import { Chat_Room_Role_Zod_Schema } from '@src/schema/chatRoom';
import { get_Db_Monggo } from '@src/connect/mongo';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Update_Setup_Chat_Room_Role {
    private _serviceRedis = ServiceRedis.getInstance();
    private _cache_get_chat_room_role_with_crid_aaid = new Cache_Get_Chat_Room_Role_With_Crid_Aaid();
    private _cache_get_all_chat_room_role_with_crid = new Cache_Get_All_Chat_Room_Role_With_Crid();

    constructor() {
        this._serviceRedis.init();
        this._cache_get_chat_room_role_with_crid_aaid.init();
        this._cache_get_all_chat_room_role_with_crid.init();
    }

    setup = async (
        req: Request<any, any, Update_Setup_Chat_Room_Role_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<Chat_Room_Role_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Update_Setup_Chat_Room_Role-setup) !',
        };

        const update_setup_chat_room_role_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_Refresh_Token(refreshToken);

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
            if (update_setup_chat_room_role_body.account_id === id) {
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

    main = async (req: Request<any, any, Update_Setup_Chat_Room_Role_Body_Field>, res: Response) => {
        const update_setup_chat_room_role_body = req.body;

        const my_response: My_Response_Field<Chat_Room_Role_Field> = {
            is_success: false,
            message: 'Băt đầu cập nhật (Handle_Update_Setup_Chat_Room_Role-main) !',
        };

        const mutateDB = new MutateDB_Update_Setup_Chat_Room_Role();
        mutateDB.set_Update_Setup_Chat_Room_Role_Body(update_setup_chat_room_role_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                const rData = result;

                await update_Chat_Room_Role_Mongo(rData);

                const crid = rData.chat_room_id;
                const aaid = rData.authorized_account_id;
                this._cache_get_chat_room_role_with_crid_aaid.set_Body({
                    chat_room_id: crid,
                    authorized_account_id: aaid,
                }); // sap bo
                this._cache_get_chat_room_role_with_crid_aaid.clear_Cache(); // sap bo
                this._cache_get_chat_room_role_with_crid_aaid.set_Fk_Crid(crid);
                this._cache_get_chat_room_role_with_crid_aaid.clear_Cache_With_Fk_Crid();

                this._cache_get_all_chat_room_role_with_crid.set_Body({ chat_room_id: crid });
                this._cache_get_all_chat_room_role_with_crid.clear_Cache();

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
            console.error(error);
            my_response.message = 'Cập nhật KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

async function update_Chat_Room_Role_Mongo(chat_room_role: Chat_Room_Role_Field) {
    const chat_room_role_schema: Chat_Room_Role_Schema = {
        authorized_account_id: chat_room_role.authorized_account_id,
        is_read: chat_room_role.is_read,
        is_send: chat_room_role.is_send,
        chat_room_id: chat_room_role.chat_room_id,
        zalo_oa_id: '',
        account_id: chat_room_role.account_id,
    };

    const parsed_chat_room_role = Chat_Room_Role_Zod_Schema.safeParse(chat_room_role_schema);
    if (!parsed_chat_room_role.success) {
        console.error('Invalid chatRoomRole format:', parsed_chat_room_role.error);
    } else {
        const db = get_Db_Monggo();
        const data_parse = parsed_chat_room_role.data;
        const col = db.collection<Chat_Room_Role_Schema>('chat_room_role');

        const { zalo_oa_id, ...doc } = data_parse as any;

        await col.updateOne(
            {
                chat_room_id: chat_room_role_schema.chat_room_id,
                authorized_account_id: chat_room_role_schema.authorized_account_id,
            },
            { $set: doc },
            { upsert: true }
        );
    }
}

export default Handle_Update_Setup_Chat_Room_Role;
