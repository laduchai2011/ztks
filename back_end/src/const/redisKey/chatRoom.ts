import dotenv from 'dotenv';
import ServiceRedis from '@src/cache/cacheRedis';
import { ChatRoomField, ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import {
    GetChatRoomWithIdBodyField,
    ChatRoomRoleWithCridAaidBodyField,
    GetAllChatRoomRoleWithCridBodyField,
    GetChatRoomWithZaloOaIdUserIdByAppBodyField,
} from '@src/dataStruct/chatRoom/body';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

const prefix_cache_getChatRoomWithId = {
    key: {
        main: isProduct ? 'cache_get_chatRoomWithId' : 'cache_get_chatRoomWithId_dev',
    },
    time: 60 * 5, // 5p
};

const prefix_cache_getChatRoomRoleWithCridAaid = {
    key: {
        main: isProduct ? 'cache_get_chatRoomRoleWithCridAaid' : 'cache_get_chatRoomRoleWithCridAaid_dev',
        cache_keys_with_crid: 'cache_get_chatRoomRoles_cache_keys_with_crid',
    },
    time: 60 * 5, // 5p
};

const prefix_cache_getAllChatRoomRoleWithCrid = {
    key: {
        main: isProduct ? 'cache_get_allChatRoomRoleWithCrid' : 'cache_get_allChatRoomRoleWithCrid_dev',
    },
    time: 60 * 5, // 5p
};

const prefix_cache_getChatRoomWithZaloOaIdUserIdByApp = {
    key: {
        main: isProduct ? 'cache_get_chatRoomWithZaloOaIdUserIdByApp' : 'cache_get_chatRoomWithZaloOaIdUserIdByApp_dev',
    },
    time: 60 * 5, // 5p
};

interface OptionsField {
    logPrameter?: string;
}

export class CacheGetChatRoomWithId {
    private _body: GetChatRoomWithIdBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _options?: OptionsField;

    constructor(options?: OptionsField) {
        this._options = options;
    }

    logError(...args: unknown[]) {
        if (this._options?.logPrameter) {
            console.error('CacheGetChatRoomWithId', this._options.logPrameter, ...args);
        } else {
            console.error('CacheGetChatRoomWithId', ...args);
        }
    }

    init() {
        this._serviceRedis.init();
    }

    setBody(body: GetChatRoomWithIdBodyField) {
        this._body = body;
    }

    getKeyMain() {
        if (!this._body) {
            this.logError('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_getChatRoomWithId.key.main}_id${this._body.id}`;

        return key_main;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_getChatRoomWithId.time;
        return timeExpireat;
    }

    async setData(data: ChatRoomField) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();

        if (!key_main) {
            this.logError('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<ChatRoomField>(key_main, data, timeExpireat);
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

        const data = await this._serviceRedis.getData<ChatRoomField>(key_main);

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

export class CacheGetChatRoomRoleWithCridAaid {
    private _body: ChatRoomRoleWithCridAaidBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _fkCrid: number | undefined;

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    setBody(body: ChatRoomRoleWithCridAaidBodyField) {
        this._body = body;
    }

    setFkCrid(fkCrid: number) {
        this._fkCrid = fkCrid;
    }

    getKeyMain() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_getChatRoomRoleWithCridAaid.key.main}_crid${this._body.chatRoomId}_aaid${this._body.authorizedAccountId}`;

        return key_main;
    }

    getKeyCacheKeysWithCrid() {
        if (!this._fkCrid) {
            console.error('Chưa thiết lập fkCrid');
            return;
        }
        const key_cache_keys_with_crid = `${prefix_cache_getChatRoomRoleWithCridAaid.key.cache_keys_with_crid}_fkCrid${this._fkCrid}`;
        return key_cache_keys_with_crid;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_getChatRoomRoleWithCridAaid.time;
        return timeExpireat;
    }

    async setData(data: ChatRoomRoleField) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();
        const key_cache_keys_with_crid = this.getKeyCacheKeysWithCrid();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        if (!key_cache_keys_with_crid) {
            console.error('Lấy key_cache_keys_with_crid không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<ChatRoomRoleField>(key_main, data, timeExpireat);
        if (!isSet) {
            console.error('Failed to set in Redis', key_main);
        }

        const clientRedis = this._serviceRedis.getClientRedis();
        await clientRedis.sAdd(key_cache_keys_with_crid, key_main);
        await clientRedis.expire(key_cache_keys_with_crid, timeExpireat);

        return isSet;
    }

    async getData() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<ChatRoomRoleField>(key_main);

        return data;
    }

    async clearCache() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        await this._serviceRedis.deleteData(key_main);
    }

    async clearCacheWithFkCrid() {
        const key_cache_keys_with_crid = this.getKeyCacheKeysWithCrid();

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

export class CacheGetAllChatRoomRoleWithCrid {
    private _body: GetAllChatRoomRoleWithCridBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    setBody(body: GetAllChatRoomRoleWithCridBodyField) {
        this._body = body;
    }

    getKeyMain() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_getAllChatRoomRoleWithCrid.key.main}_crid${this._body.chatRoomId}`;

        return key_main;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_getAllChatRoomRoleWithCrid.time;
        return timeExpireat;
    }

    async setData(data: ChatRoomRoleField[]) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<ChatRoomRoleField[]>(key_main, data, timeExpireat);
        if (!isSet) {
            console.error('Failed to set in Redis', key_main);
        }

        return isSet;
    }

    async getData() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<ChatRoomRoleField[]>(key_main);

        return data;
    }

    async clearCache() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        await this._serviceRedis.deleteData(key_main);
    }
}

export class CacheGetChatRoomWithZaloOaIdUserIdByApp {
    private _body: GetChatRoomWithZaloOaIdUserIdByAppBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    setBody(body: GetChatRoomWithZaloOaIdUserIdByAppBodyField) {
        this._body = body;
    }

    getKeyMain() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_getChatRoomWithZaloOaIdUserIdByApp.key.main}_zaloOaId${this._body.zaloOaId}_userIdByApp${this._body.userIdByApp}`;

        return key_main;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_getChatRoomWithZaloOaIdUserIdByApp.time;
        return timeExpireat;
    }

    async setData(data: ChatRoomField) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<ChatRoomField>(key_main, data, timeExpireat);
        if (!isSet) {
            console.error('Failed to set in Redis', key_main);
        }

        return isSet;
    }

    async getData() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<ChatRoomField>(key_main);

        return data;
    }

    async clearCache() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        await this._serviceRedis.deleteData(key_main);
    }
}
