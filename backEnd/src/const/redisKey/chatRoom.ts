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

export class CacheGetChatRoomWithId {
    private _body: GetChatRoomWithIdBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    setBody(body: GetChatRoomWithIdBodyField) {
        this._body = body;
    }

    getKeyMain() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
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

export class CacheGetChatRoomRoleWithCridAaid {
    private _body: ChatRoomRoleWithCridAaidBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    setBody(body: ChatRoomRoleWithCridAaidBodyField) {
        this._body = body;
    }

    getKeyMain() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_getChatRoomRoleWithCridAaid.key.main}_crid${this._body.chatRoomId}_aaid${this._body.authorizedAccountId}`;

        return key_main;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_getChatRoomRoleWithCridAaid.time;
        return timeExpireat;
    }

    async setData(data: ChatRoomRoleField) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<ChatRoomRoleField>(key_main, data, timeExpireat);
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
