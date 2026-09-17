import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Chat_Room_Field, Chat_Room_Role_Schema } from '@src/datastruct/chat_room';
import { Change_Chat_Room_Master_Body_Field } from '@src/datastruct/chat_room/body';
import MutateDB_Change_Chat_Room_Master from '../../mutateDB/Change_Chat_Room_Master';
import { verify_refresh_token } from '@src/token';
import { get_Db_Monggo } from '@src/connect/mongo';
import {
    Cache_Get_Chat_Room_With_Id,
    Cache_Get_Chat_Room_Role_With_Crid_Aaid,
    Cache_Get_All_Chat_Room_Role_With_Crid,
    Cache_Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App,
} from '@src/const/redisKey/chat_room';
import { Chat_Room_Role_Zod_Schema, Chat_Room_Role_Schema_Type } from '@src/schema/chatRoom';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Change_Chat_Room_Master {
    private _cache_get_chat_room_with_id = new Cache_Get_Chat_Room_With_Id({ log_prameter: 'Handle_Change_Chat_Room_Master' });
    private _cache_get_chat_room_role_with_crid_aaid = new Cache_Get_Chat_Room_Role_With_Crid_Aaid();
    private _cache_get_all_chat_room_role_with_crid = new Cache_Get_All_Chat_Room_Role_With_Crid();
    private _cache_get_chat_room_with_zalo_oa_id_user_id_by_app = new Cache_Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App();

    constructor() {
        this._cache_get_chat_room_with_id.init();
        this._cache_get_chat_room_role_with_crid_aaid.init();
        this._cache_get_all_chat_room_role_with_crid.init();
        this._cache_get_chat_room_with_zalo_oa_id_user_id_by_app.init();
    }

    setup = async (req: Request<any, any, Change_Chat_Room_Master_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Chat_Room_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Change_Chat_Room_Master-setup) !',
        };

        const change_chat_room_master_body = req.body;
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
            change_chat_room_master_body.account_id = id;
            res.locals.change_chat_room_master_body = change_chat_room_master_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const change_chat_room_master_body = res.locals.change_chat_room_master_body as Change_Chat_Room_Master_Body_Field;

        const my_response: My_Response_Field<Chat_Room_Field> = {
            is_success: false,
            message: 'Bắt đầu cập nhật (Handle_Change_Chat_Room_Master-main) !',
        };

        const mutateDB = new MutateDB_Change_Chat_Room_Master();
        mutateDB.set_Change_Chat_Room_Master_Body(change_chat_room_master_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                const rData = result;

                this._cache_get_chat_room_with_id.set_Body({ id: rData.id });
                await this._cache_get_chat_room_with_id.clear_Cache();

                this._cache_get_chat_room_role_with_crid_aaid.set_Fk_Crid(rData.id);
                await this._cache_get_chat_room_role_with_crid_aaid.clear_Cache_With_Fk_Crid();

                this._cache_get_all_chat_room_role_with_crid.set_Body({ chat_room_id: rData.id });
                await this._cache_get_all_chat_room_role_with_crid.clear_Cache();

                this._cache_get_chat_room_with_zalo_oa_id_user_id_by_app.set_Body({
                    zalo_oa_id: rData.zalo_oa_id,
                    user_id_by_app: rData.user_id_by_app,
                });
                await this._cache_get_chat_room_with_zalo_oa_id_user_id_by_app.clear_Cache();

                await clear_Mongo(change_chat_room_master_body.chat_room_id, change_chat_room_master_body.account_id);

                await create_Chat_Room_Role_Mongo(rData, rData.zalo_oa_id);

                const data = rData;
                my_response.message = 'Cập nhật thành công !';
                my_response.is_success = true;
                my_response.data = data;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Cập nhật KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            console.error(error);
            my_response.message = 'Cập nhật KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

async function clear_Mongo(chat_room_id: string, account_id: string) {
    const db = get_Db_Monggo();
    const col__chat_room_role = db.collection('chat_room_role');
    const col__new_message = db.collection('new_message');

    await col__chat_room_role.deleteMany({
        chat_room_id: chat_room_id,
        account_id: account_id,
    });

    await col__new_message.deleteMany({
        account_id: account_id,
    });
}

async function create_Chat_Room_Role_Mongo(chat_room: Chat_Room_Field, zalo_oa_id: string) {
    const chat_romm_role_schema: Chat_Room_Role_Schema = {
        authorized_account_id: chat_room.account_id,
        is_read: true,
        is_send: true,
        chat_room_id: chat_room.id,
        zalo_oa_id: zalo_oa_id,
        account_id: chat_room.account_id,
    };
    const parsed_chat_room_role = Chat_Room_Role_Zod_Schema.safeParse(chat_romm_role_schema);
    if (!parsed_chat_room_role.success) {
        console.error('Invalid chat_room_role format:', parsed_chat_room_role.error);
    } else {
        const dbMonggo = get_Db_Monggo();
        const data_parse = parsed_chat_room_role.data;
        await dbMonggo.collection<Chat_Room_Role_Schema_Type>('chat_room_role').insertOne(data_parse);
    }
}

export default Handle_Change_Chat_Room_Master;
