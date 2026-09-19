import ServiceRedis from '@src/cache/cacheRedis';
import { Hook_Call_Field } from '@src/data_struct/zalo/hook_data';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { User_Take_Room_To_Chat_Body_Field } from '@src/data_struct/chat_room/body';
import { Cache_Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App } from '@src/const/redisKey/chat_room';
import QueryDB_User_Take_Room_To_Chat from '../handleHookData/queryDB/User_Take_Room_To_Chat';

import { send_Message_To_User } from '../send_Message_To_User';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

export async function hook_Call_Get_Chat_Room(
    hook_data: Hook_Call_Field,
    zalo_oa: Zalo_Oa_Field
): Promise<Chat_Room_Field | undefined> {
    const user_id_by_app = hook_data.user_id_by_app;
    const zalo_oa_id = zalo_oa.id;
    const user_take_room_to_chat_body: User_Take_Room_To_Chat_Body_Field = {
        user_id_by_app: user_id_by_app,
        zalo_oa_id: zalo_oa_id,
    };

    const cache_get_chat_room_with_zalo_oa_id_user_id_by_app = new Cache_Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App();
    await cache_get_chat_room_with_zalo_oa_id_user_id_by_app.init();
    cache_get_chat_room_with_zalo_oa_id_user_id_by_app.set_Body({
        zalo_oa_id: zalo_oa_id,
        user_id_by_app: user_id_by_app,
    });

    const chat_room_cache = await cache_get_chat_room_with_zalo_oa_id_user_id_by_app.get_Data();

    if (chat_room_cache) {
        return chat_room_cache;
    }

    const queryDB = new QueryDB_User_Take_Room_To_Chat();
    queryDB.set_User_Take_Room_To_Chat_Body(user_take_room_to_chat_body);

    try {
        const result = await queryDB.run();
        if (result) {
            cache_get_chat_room_with_zalo_oa_id_user_id_by_app.set_Data(result);

            return result;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

export async function hook_Call_Feedback_To_Take_Chat_Session(
    zalo_app: Zalo_App_Field,
    zalo_oa: Zalo_Oa_Field,
    hook_data: Hook_Call_Field
) {
    send_Message_To_User(zalo_app, zalo_oa, {
        recipient: { user_id: hook_data.user_id },
        message: { text: 'Vui lòng nhập mã phiên !' },
    });
}
