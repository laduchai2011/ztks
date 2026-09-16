import dotenv from 'dotenv';
import ServiceRedis from '@src/cache/cacheRedis';
import { Call_Agent_Field, Call_PerMit_Field } from '@src/dataStruct/callAgent';
import { Get_Call_Agent_With_Account_Id_Body_Field, Get_Call_Permit_With_Uid_Body_Field } from '@src/dataStruct/callAgent/body';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

const prefix_cache__get_call_agent_with_account_id = {
    key: {
        main: isProduct ? 'cache__get_call_agent_with_account_id' : 'cache__get_call_agent_with_account_id_dev',
    },
    time: 60 * 5, // 5p
};

const prefix_cache__get_call_permit_with_uid = {
    key: {
        main: isProduct ? 'cache__get_call_permit_with_uid' : 'cache__get_call_permit_with_uid_dev',
    },
    time: 60 * 5, // 5p
};

interface Options_Field {
    log_prameter?: string;
}

export class Cache_Get_Call_Agent_With_Account_Id {
    private _body: Get_Call_Agent_With_Account_Id_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _options?: Options_Field;

    constructor(options?: Options_Field) {
        this._options = options;
    }

    log_Error(...args: unknown[]) {
        if (this._options?.log_prameter) {
            console.error('Cache_Get_Call_Agent_With_Account_Id', this._options.log_prameter, ...args);
        } else {
            console.error('Cache_Get_Call_Agent_With_Account_Id', ...args);
        }
    }

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_Call_Agent_With_Account_Id_Body_Field) {
        this._body = body;
    }

    get_Key_Main() {
        if (!this._body) {
            this.log_Error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_call_agent_with_account_id.key.main}_account_id${this._body.account_id}`;

        return key_main;
    }

    get_Time_Expireat() {
        const time_expireat = prefix_cache__get_call_agent_with_account_id.time;
        return time_expireat;
    }

    async set_Data(data: Call_Agent_Field) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();

        if (!key_main) {
            this.log_Error('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<Call_Agent_Field>(key_main, data, time_expireat);
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

        const data = await this._serviceRedis.getData<Call_Agent_Field>(key_main);

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

export class Cache_Get_Call_Permit_With_Uid {
    private _body: Get_Call_Permit_With_Uid_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _options?: Options_Field;

    constructor(options?: Options_Field) {
        this._options = options;
    }

    log_Error(...args: unknown[]) {
        if (this._options?.log_prameter) {
            console.error('Cache_Get_Call_Permit_With_Uid', this._options.log_prameter, ...args);
        } else {
            console.error('Cache_Get_Call_Permit_With_Uid', ...args);
        }
    }

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_Call_Permit_With_Uid_Body_Field) {
        this._body = body;
    }

    get_Key_Main() {
        if (!this._body) {
            this.log_Error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_call_permit_with_uid.key.main}_uid${this._body.uid}`;

        return key_main;
    }

    get_Time_Expireat() {
        const time_expireat = prefix_cache__get_call_permit_with_uid.time;
        return time_expireat;
    }

    async set_Data(data: Call_PerMit_Field) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();

        if (!key_main) {
            this.log_Error('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<Call_PerMit_Field>(key_main, data, time_expireat);
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

        const data = await this._serviceRedis.getData<Call_PerMit_Field>(key_main);

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
