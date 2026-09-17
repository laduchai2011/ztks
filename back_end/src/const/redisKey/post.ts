import dotenv from 'dotenv';
import ServiceRedis from '@src/cache/cacheRedis';
import { Paged_Post_Field, Paged_Register_Post_Field, Post_Field, Register_Post_Field } from '@src/data_struct/post';
import {
    Get_Posts_Body_Field,
    Get_Register_Posts_Body_Field,
    Get_Post_With_Id_Body_Field,
    Get_Register_Post_With_Id_Body_Field,
} from '@src/data_struct/post/body';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

const prefix_cache__get_posts = {
    key: {
        main: isProduct ? 'cache__get_posts' : 'cache__get_posts_dev',
        cache_keys: isProduct ? 'cache__get_posts_cache_keys' : 'cache__get_posts_cache_keys_dev',
    },
    time: 60 * 5, // 5p
};

const prefix_cache__get_register_posts = {
    key: {
        main: isProduct ? 'cache__get_register_posts' : 'cache__get_register_posts_dev',
        cache_keys: isProduct ? 'cache__get_register_posts_cache_keys' : 'cache__get_register_posts_cache_keys_dev',
    },
    time: 60 * 5, // 5p
};

const prefix_cache__get_post_with_id = {
    key: {
        main: isProduct ? 'cache__get_post_with_id' : 'cache__get_post_with_id_dev',
    },
    time: 60 * 5, // 5p
};

const prefix_cache__get_register_post_with_id = {
    key: {
        main: isProduct ? 'cache__get_register_post_with_id' : 'cache__get_register_post_with_id_dev',
    },
    time: 60 * 5, // 5p
};

export class Cache_Get_Posts {
    private _body: Get_Posts_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _fk: string | undefined;

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_Posts_Body_Field) {
        this._body = body;
    }

    set_Fk(fk: string) {
        this._fk = fk;
    }

    get_Key_Main() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_posts.key.main}_page${this._body.page}_size${this._body.size}_isActive${this._body.is_active}_registerPostId${this._body.register_post_id}`;

        return key_main;
    }

    get_Key_Cache_Keys() {
        if (!this._fk) {
            console.error('Chưa thiết lập fk');
            return;
        }
        const key_cache_keys = `${prefix_cache__get_posts.key.cache_keys}_fk${this._fk}`;
        return key_cache_keys;
    }

    get_Time_Expireat() {
        const time_expireat = prefix_cache__get_posts.time;
        return time_expireat;
    }

    async set_Data(datas: Paged_Post_Field) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();
        const key_cache_keys = this.get_Key_Cache_Keys();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        if (!key_cache_keys) {
            console.error('Lấy key_cache_keys không thành công');
            return;
        }

        const is_set = await this._serviceRedis.setData<Paged_Post_Field>(key_main, datas, time_expireat);
        if (!is_set) {
            console.error('Failed to set in Redis', key_main);
        }

        const clientRedis = this._serviceRedis.getClientRedis();
        await clientRedis.sAdd(key_cache_keys, key_main);
        await clientRedis.expire(key_cache_keys, time_expireat);

        return is_set;
    }

    async get_Data() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<Paged_Post_Field>(key_main);

        return data;
    }

    async clear_Cache() {
        const key_cache_keys = this.get_Key_Cache_Keys();

        if (!key_cache_keys) {
            console.error('Lấy key_cache_keys không thành công');
            return;
        }

        const client_redis = this._serviceRedis.getClientRedis();
        const keys_main = await client_redis.sMembers(key_cache_keys);
        keys_main.map((key) => {
            this._serviceRedis.deleteData(key);
        });
        await client_redis.del(key_cache_keys);
    }
}

export class Cache_Get_Register_Posts {
    private _body: Get_Register_Posts_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();
    private _fk: string | undefined;

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_Register_Posts_Body_Field) {
        this._body = body;
    }

    set_Fk(fk: string) {
        this._fk = fk;
    }

    get_Key_Main() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_register_posts.key.main}_page${this._body.page}_size${this._body.size}_isDelete${this._body.is_delete}_accountId${this._body.account_id}`;

        return key_main;
    }

    get_Key_Cache_Keys() {
        if (!this._fk) {
            console.error('Chưa thiết lập fk');
            return;
        }

        const key_cache_keys = `${prefix_cache__get_register_posts.key.cache_keys}_fk${this._fk}`;
        return key_cache_keys;
    }

    get_Time_Expireat() {
        const time_expireat = prefix_cache__get_register_posts.time;
        return time_expireat;
    }

    async set_Data(datas: Paged_Register_Post_Field) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();
        const key_cache_keys = this.get_Key_Cache_Keys();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        if (!key_cache_keys) {
            console.error('Lấy key_cache_keys không thành công');
            return;
        }

        const is_set = await this._serviceRedis.setData<Paged_Register_Post_Field>(key_main, datas, time_expireat);
        if (!is_set) {
            console.error('Failed to set in Redis', key_main);
        }

        const client_redis = this._serviceRedis.getClientRedis();
        await client_redis.sAdd(key_cache_keys, key_main);
        await client_redis.expire(key_cache_keys, time_expireat);

        return is_set;
    }

    async get_Data() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<Paged_Register_Post_Field>(key_main);

        return data;
    }

    async clear_Cache() {
        const key_cache_keys = this.get_Key_Cache_Keys();

        if (!key_cache_keys) {
            console.error('Lấy key_cache_keys không thành công');
            return;
        }

        const client_redis = this._serviceRedis.getClientRedis();
        const keys_main = await client_redis.sMembers(key_cache_keys);
        keys_main.map((key) => {
            this._serviceRedis.deleteData(key);
        });
        await client_redis.del(key_cache_keys);
    }
}

export class Cache_Get_Post_With_Id {
    private _body: Get_Post_With_Id_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_Post_With_Id_Body_Field) {
        this._body = body;
    }

    get_Key_Main() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_post_with_id.key.main}_id${this._body.id}`;

        return key_main;
    }

    get_Time_Expireat() {
        const time_expireat = prefix_cache__get_post_with_id.time;
        return time_expireat;
    }

    async set_Data(data: Post_Field) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const is_set = await this._serviceRedis.setData<Post_Field>(key_main, data, time_expireat);
        if (!is_set) {
            console.error('Failed to set in Redis', key_main);
        }

        return is_set;
    }

    async get_Data() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<Post_Field>(key_main);

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

export class Cache_Get_Register_Post_With_Id {
    private _body: Get_Register_Post_With_Id_Body_Field | undefined;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {}

    init() {
        this._serviceRedis.init();
    }

    set_Body(body: Get_Register_Post_With_Id_Body_Field) {
        this._body = body;
    }

    get_Key_Main() {
        if (!this._body) {
            console.error('Chưa thiết lập body');
            return;
        }

        const key_main = `${prefix_cache__get_register_post_with_id.key.main}_id${this._body.id}`;

        return key_main;
    }

    get_Time_Expireat() {
        const time_expireat = prefix_cache__get_register_post_with_id.time;
        return time_expireat;
    }

    async set_Data(data: Register_Post_Field) {
        const key_main = this.get_Key_Main();
        const time_expireat = this.get_Time_Expireat();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const is_set = await this._serviceRedis.setData<Register_Post_Field>(key_main, data, time_expireat);
        if (!is_set) {
            console.error('Failed to set in Redis', key_main);
        }

        return is_set;
    }

    async get_Data() {
        const key_main = this.get_Key_Main();

        if (!key_main) {
            console.error('Lấy key_main không thành công');
            return;
        }

        const data = await this._serviceRedis.getData<Register_Post_Field>(key_main);

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
