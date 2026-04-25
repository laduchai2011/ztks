import dotenv from 'dotenv';
import ServiceRedis from '@src/cache/cacheRedis';
import { PagedPostField, PagedRegisterPostField, PostField } from '@src/dataStruct/post';
import { GetPostsBodyField, GetRegisterPostsBodyField, GetPostWithIdBodyField } from '@src/dataStruct/post/body';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

const prefix_cache_getPosts = {
    key: {
        main: isProduct ? 'cache_get_posts' : 'cache_get_posts_dev',
        cache_keys: 'cache_get_posts_cache_keys',
    },
    time: 60 * 5, // 5p
};

const prefix_cache_getRegisterPosts = {
    key: {
        main: isProduct ? 'cache_get_registerPosts' : 'cache_get_registerPosts_dev',
        cache_keys: 'cache_get_registerPosts_cache_keys',
    },
    time: 60 * 5, // 5p
};

const prefix_cache_getPostWithId = {
    key: {
        main: isProduct ? 'cache_get_postWithId' : 'cache_get_postWithId_dev',
    },
    time: 60 * 5, // 5p
};

export class CacheGetPosts {
    private _body: GetPostsBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _fk: number | undefined;

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    setBody(body: GetPostsBodyField) {
        this._body = body;
    }

    setFK(fk: number) {
        this._fk = fk;
    }

    getKeyMain() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_getPosts.key.main}${this._body.page}${this._body.size}${this._body.isActive}${this._body.registerPostId}`;

        return key_main;
    }

    getKeyCacheKeys() {
        if (!this._fk) {
            console.error('Chưa thiết lập fk');
            return;
        }
        const key_cache_keys = `${prefix_cache_getPosts.key.cache_keys}fk${this._fk}`;
        return key_cache_keys;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_getPosts.time;
        return timeExpireat;
    }

    async setData(datas: PagedPostField) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();
        const key_cache_keys = this.getKeyCacheKeys();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        if (!key_cache_keys) {
            console.error('Lấy key_cache_keys không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<PagedPostField>(key_main, datas, timeExpireat);
        if (!isSet) {
            console.error('Failed to set in Redis', key_main);
        }

        const clientRedis = this._serviceRedis.getClientRedis();
        await clientRedis.sAdd(key_cache_keys, key_main);
        await clientRedis.expire(key_cache_keys, timeExpireat);

        return isSet;
    }

    async getData() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<PagedPostField>(key_main);

        return data;
    }

    async clearCache() {
        const key_cache_keys = this.getKeyCacheKeys();

        if (!key_cache_keys) {
            console.error('Lấy key_cache_keys không thành công');
            return;
        }

        const clientRedis = this._serviceRedis.getClientRedis();
        const keys_main = await clientRedis.sMembers(key_cache_keys);
        keys_main.map((key) => {
            this._serviceRedis.deleteData(key);
        });
        await clientRedis.del(key_cache_keys);
    }
}

export class CacheGetRegisterPosts {
    private _body: GetRegisterPostsBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _fk: number | undefined;

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    setBody(body: GetRegisterPostsBodyField) {
        this._body = body;
    }

    setFK(fk: number) {
        this._fk = fk;
    }

    getKeyMain() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_getRegisterPosts.key.main}${this._body.page}${this._body.size}${this._body.isDelete}${this._body.accountId}`;

        return key_main;
    }

    getKeyCacheKeys() {
        if (!this._fk) {
            console.error('Chưa thiết lập fk');
            return;
        }

        const key_cache_keys = `${prefix_cache_getRegisterPosts.key.cache_keys}fk${this._fk}`;
        return key_cache_keys;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_getRegisterPosts.time;
        return timeExpireat;
    }

    async setData(datas: PagedRegisterPostField) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();
        const key_cache_keys = this.getKeyCacheKeys();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        if (!key_cache_keys) {
            console.error('Lấy key_cache_keys không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<PagedRegisterPostField>(key_main, datas, timeExpireat);
        if (!isSet) {
            console.error('Failed to set in Redis', key_main);
        }

        const clientRedis = this._serviceRedis.getClientRedis();
        await clientRedis.sAdd(key_cache_keys, key_main);
        await clientRedis.expire(key_cache_keys, timeExpireat);

        return isSet;
    }

    async getData() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<PagedRegisterPostField>(key_main);

        return data;
    }

    async clearCache() {
        const key_cache_keys = this.getKeyCacheKeys();

        if (!key_cache_keys) {
            console.error('Lấy key_cache_keys không thành công');
            return;
        }

        const clientRedis = this._serviceRedis.getClientRedis();
        const keys_main = await clientRedis.sMembers(key_cache_keys);
        keys_main.map((key) => {
            this._serviceRedis.deleteData(key);
        });
        await clientRedis.del(key_cache_keys);
    }
}

export class CacheGetPostWithId {
    private _body: GetPostWithIdBodyField | undefined;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    setBody(body: GetPostWithIdBodyField) {
        this._body = body;
    }

    getKeyMain() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache_getPostWithId.key.main}${this._body.id}`;

        return key_main;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_getPostWithId.time;
        return timeExpireat;
    }

    async setData(data: PostField) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<PostField>(key_main, data, timeExpireat);
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

        const data = await this._serviceRedis.getData<PostField>(key_main);

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
