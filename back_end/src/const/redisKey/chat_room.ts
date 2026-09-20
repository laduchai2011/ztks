import dotenv from 'dotenv';
import ServiceRedis from '@src/cache/cacheRedis';
import { Chat_Room_Field, Chat_Room_Role_Field } from '@src/data_struct/chat_room';
import {
    Get_Chat_Room_With_Id_Body_Field,
    Get_Chat_Room_Role_With_Crid_Aaid_Body_Field,
    Get_All_Chat_Room_Role_With_Crid_Body_Field,
    Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App_Body_Field,
} from '@src/data_struct/chat_room/body';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

const prefix_cache__get_chat_room_with_id = {
    key: {
        main: isProduct ? 'cache__get_chat_room_with_id' : 'cache__get_chat_room_with_id_dev',
    },
    time: 60 * 5, // 5p
};

const prefix_cache__get_chat_room_role_with_crid_aaid = {
    key: {
        main: isProduct ? 'cache__get_chat_room_role_with_crid_aaid' : 'cache__get_chat_room_role_with_crid_aaid_dev',
        cache_keys_with_crid: 'cache__get_chat_room_roles_cache_keys_with_crid',
    },
    time: 60 * 5, // 5p
};

const prefix_cache__get_all_chat_room_role_with_crid = {
    key: {
        main: isProduct ? 'cache__get_all_chat_room_role_with_crid' : 'cache__get_all_chat_room_role_with_crid_dev',
    },
    time: 60 * 5, // 5p
};

const prefix_cache__get_chat_room_with_zalo_oa_id_user_id_by_app = {
    key: {
        main: isProduct
            ? 'cache__get_chat_room_with_zalo_oa_id_user_id_by_app'
            : 'cache__get_chat_room_with_zalo_oa_id_user_id_by_app_dev',
    },
    time: 60 * 5, // 5p
};

interface OptionsField {
    log_prameter?: string;
}

export class Cache_Get_Chat_Room_With_Id {
    private _body: Get_Chat_Room_With_Id_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _options?: OptionsField;

    constructor(options?: OptionsField) {
        this._options = options;
    }

    log_Error(...args: unknown[]) {
        if (this._options?.log_prameter) {
            console.error('Cache_Get_Chat_Room_With_Id', this._options.log_prameter, ...args);
        } else {
            console.error('Cache_Get_Chat_Room_With_Id', ...args);
        }
    }

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_Chat_Room_With_Id_Body_Field) {
        this._body = body;
    }

    get_Key_Main() {
        if (!this._body) {
            this.log_Error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_chat_room_with_id.key.main}_id${this._body.id}`;

        return key_main;
    }

    get_Time_Expireat() {
        const time_expireat = prefix_cache__get_chat_room_with_id.time;
        return time_expireat;
    }

    async set_Data(data: Chat_Room_Field) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();

        if (!key_main) {
            this.log_Error('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<Chat_Room_Field>(key_main, data, time_expireat);
        if (!isSet) {
            this.log_Error('Failed to set in Redis', key_main);
        }

        return isSet;
    }

    async get_Data() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            this.log_Error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<Chat_Room_Field>(key_main);

        return data;
    }

    async clear_Cache() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            this.log_Error('Lấy key_main không thành công');
            return;
        }

        await this._serviceRedis.deleteData(key_main);
    }
}

export class Cache_Get_Chat_Room_Role_With_Crid_Aaid {
    private _body: Get_Chat_Room_Role_With_Crid_Aaid_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _fk_crid: string | undefined;

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_Chat_Room_Role_With_Crid_Aaid_Body_Field) {
        this._body = body;
    }

    set_Fk_Crid(fk_crid: string) {
        this._fk_crid = fk_crid;
    }

    get_Key_Main() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_chat_room_role_with_crid_aaid.key.main}_crid${this._body.chat_room_id}_aaid${this._body.authorized_account_id}`;

        return key_main;
    }

    get_Key_Cache_Keys_With_Crid() {
        if (!this._fk_crid) {
            console.error('Chưa thiết lập fkCrid');
            return;
        }
        const key_cache_keys_with_crid = `${prefix_cache__get_chat_room_role_with_crid_aaid.key.cache_keys_with_crid}_fk_crid${this._fk_crid}`;
        return key_cache_keys_with_crid;
    }

    get_Time_Expireat() {
        const time_expireat = prefix_cache__get_chat_room_role_with_crid_aaid.time;
        return time_expireat;
    }

    async set_Data(data: Chat_Room_Role_Field) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();
        const key_cache_keys_with_crid = this.get_Key_Cache_Keys_With_Crid();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        if (!key_cache_keys_with_crid) {
            console.error('Lấy key_cache_keys_with_crid không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<Chat_Room_Role_Field>(key_main, data, time_expireat);
        if (!isSet) {
            console.error('Failed to set in Redis', key_main);
        }

        const clientRedis = this._serviceRedis.getClientRedis();
        await clientRedis.sAdd(key_cache_keys_with_crid, key_main);
        await clientRedis.expire(key_cache_keys_with_crid, time_expireat);

        return isSet;
    }

    async get_Data() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<Chat_Room_Role_Field>(key_main);

        return data;
    }

    async clear_Cache() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        await this._serviceRedis.deleteData(key_main);
    }

    async clear_Cache_With_Fk_Crid() {
        const key_cache_keys_with_crid = this.get_Key_Cache_Keys_With_Crid();

        if (!key_cache_keys_with_crid) {
            console.error('Lấy key_cache_keys_with_crid không thành công');
            return;
        }

        const clientRedis = this._serviceRedis.getClientRedis();
        const keys_main = await clientRedis.sMembers(key_cache_keys_with_crid);
        keys_main.map((key) => {
            this._serviceRedis.deleteData(key);
        });
        await clientRedis.del(key_cache_keys_with_crid);
    }
}

export class Cache_Get_All_Chat_Room_Role_With_Crid {
    private _body: Get_All_Chat_Room_Role_With_Crid_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_All_Chat_Room_Role_With_Crid_Body_Field) {
        this._body = body;
    }

    get_Key_Main() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_all_chat_room_role_with_crid.key.main}_crid${this._body.chat_room_id}`;

        return key_main;
    }

    get_Time_Expireat() {
        const timeExpireat = prefix_cache__get_all_chat_room_role_with_crid.time;
        return timeExpireat;
    }

    async set_Data(data: Chat_Room_Role_Field[]) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<Chat_Room_Role_Field[]>(key_main, data, time_expireat);
        if (!isSet) {
            console.error('Failed to set in Redis', key_main);
        }

        return isSet;
    }

    async get_Data() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<Chat_Room_Role_Field[]>(key_main);

        return data;
    }

    async clear_Cache() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        await this._serviceRedis.deleteData(key_main);
    }
}

export class Cache_Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App {
    private _body: Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App_Body_Field) {
        this._body = body;
    }

    get_Key_Main() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_chat_room_with_zalo_oa_id_user_id_by_app.key.main}_zalo_oa_id${this._body.zalo_oa_id}_user_id_by_app${this._body.user_id_by_app}`;

        return key_main;
    }

    get_Time_Expireat() {
        const time_expireat = prefix_cache__get_chat_room_with_zalo_oa_id_user_id_by_app.time;
        return time_expireat;
    }

    async set_Data(data: Chat_Room_Field) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<Chat_Room_Field>(key_main, data, time_expireat);
        if (!isSet) {
            console.error('Failed to set in Redis', key_main);
        }

        return isSet;
    }

    async get_Data() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<Chat_Room_Field>(key_main);

        return data;
    }

    async clear_Cache() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        await this._serviceRedis.deleteData(key_main);
    }
}
