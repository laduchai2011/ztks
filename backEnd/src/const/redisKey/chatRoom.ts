import dotenv from 'dotenv';
import ServiceRedis from '@src/cache/cacheRedis';
import { ChatRoomField, ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import {
    GetChatRoomWithIdBodyField,
    ChatRoomRoleWithCridAaidBodyField,
    GetAllChatRoomRoleWithCridBodyField,
} from '@src/dataStruct/chatRoom/body';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

// export const prefix_cache_chatRoom_with_id = isProduct
//     ? 'prefix_cache_chatRoom_with_id'
//     : 'prefix_cache_chatRoom_with_id_dev';

// export const prefix_cache_chatRoom = {
//     key: {
//         with_id: isProduct ? 'prefix_cache_chatRoom_with_id' : 'prefix_cache_chatRoom_with_id_dev',
//     },
//     time: 60 * 5, // 5p
// };

// export const prefix_cache_chatRoomRole = {
//     key: {
//         with_crid_Aaid: isProduct
//             ? 'prefix_cache_chatRoomRole_with_crid_Aaid'
//             : 'prefix_cache_chatRoomRole_with_crid_Aaid_dev',
//         get_all_with_chatRoom_id: isProduct
//             ? 'prefix_cache_chatRoomRole_with_chatRoom_id'
//             : 'prefix_cache_chatRoomRole_with_chatRoom_id_dev',
//     },
//     time: 60 * 5, // 5p
// };

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

        const key_main = `${prefix_cache_getChatRoomWithId.key.main}${this._body.id}`;

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
