import dotenv from 'dotenv';
import ServiceRedis from '@src/cache/cacheRedis';
import { CallAgentField, CallPerMitField } from '@src/dataStruct/callAgent';
import { GetCallAgentWithAccountIdBodyField, GetCallPermitWithUidBodyField } from '@src/dataStruct/callAgent/body';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

const prefix_cache_callAgentWithAccountId = {
    key: {
        main: isProduct ? 'cache_get_callAgentWithAccountId' : 'cache_get_callAgentWithAccountId_dev',
    },
    time: 60 * 5, // 5p
};

const prefix_cache_callPermitWithUid = {
    key: {
        main: isProduct ? 'cache_get_callPermitWithUid' : 'cache_get_callPermitWithUid_dev',
    },
    time: 60 * 5, // 5p
};

interface OptionsField {
    logPrameter?: string;
}

export class CacheGetCallAgentWithAccountId {
    private _body: GetCallAgentWithAccountIdBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _options?: OptionsField;

    constructor(options?: OptionsField) {
        this._options = options;
    }

    logError(...args: unknown[]) {
        if (this._options?.logPrameter) {
            console.error('CacheGetCallAgentWithAccountId', this._options.logPrameter, ...args);
        } else {
            console.error('CacheGetCallAgentWithAccountId', ...args);
        }
    }

    init() {
        this._serviceRedis.init();
    }

    setBody(body: GetCallAgentWithAccountIdBodyField) {
        this._body = body;
    }

    getKeyMain() {
        if (!this._body) {
            this.logError('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_callAgentWithAccountId.key.main}_accountId${this._body.accountId}`;

        return key_main;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_callAgentWithAccountId.time;
        return timeExpireat;
    }

    async setData(data: CallAgentField) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();

        if (!key_main) {
            this.logError('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<CallAgentField>(key_main, data, timeExpireat);
        if (!isSet) {
            this.logError('Failed to set in Redis', key_main);
        }

        return isSet;
    }

    async getData() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            this.logError('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<CallAgentField>(key_main);

        return data;
    }

    async clearCache() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            this.logError('Lấy key_main không thành công');
            return;
        }

        await this._serviceRedis.deleteData(key_main);
    }
}

export class CacheGetCallPermitWithUid {
    private _body: GetCallPermitWithUidBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _options?: OptionsField;

    constructor(options?: OptionsField) {
        this._options = options;
    }

    logError(...args: unknown[]) {
        if (this._options?.logPrameter) {
            console.error('CacheGetCallPermitWithUid', this._options.logPrameter, ...args);
        } else {
            console.error('CacheGetCallPermitWithUid', ...args);
        }
    }

    init() {
        this._serviceRedis.init();
    }

    setBody(body: GetCallPermitWithUidBodyField) {
        this._body = body;
    }

    getKeyMain() {
        if (!this._body) {
            this.logError('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_callPermitWithUid.key.main}_uid${this._body.uid}`;

        return key_main;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_callPermitWithUid.time;
        return timeExpireat;
    }

    async setData(data: CallPerMitField) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();

        if (!key_main) {
            this.logError('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<CallPerMitField>(key_main, data, timeExpireat);
        if (!isSet) {
            this.logError('Failed to set in Redis', key_main);
        }

        return isSet;
    }

    async getData() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            this.logError('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<CallPerMitField>(key_main);

        return data;
    }

    async clearCache() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            this.logError('Lấy key_main không thành công');
            return;
        }

        await this._serviceRedis.deleteData(key_main);
    }
}
