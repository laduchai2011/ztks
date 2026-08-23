import dotenv from 'dotenv';
import ServiceRedis from '@src/cache/cacheRedis';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

const prefix_cache_producerKeyRabbitMq = {
    key: {
        main: isProduct ? 'cache_producerKeyRabbitMq' : 'cache_producerKeyRabbitMq_dev',
        cache_keys: isProduct ? 'cache_producerKeyRabbitMq_keys' : 'cache_producerKeyRabbitMq_keys_dev',
    },
    time: 60 * 60 * 24 * 30 * 6, // 6 month
};

interface OptionsField {
    logPrameter?: string;
}

export class CacheProducerKeyRabbitMq {
    private _queue: string | null = null;
    private _serviceRedis = ServiceRedis.getInstance();
    private _options?: OptionsField;

    constructor(options?: OptionsField) {
        this._options = options;
    }

    logError(...args: unknown[]) {
        if (this._options?.logPrameter) {
            console.error('CacheProducerKeyRabbitMq', this._options.logPrameter, ...args);
        } else {
            console.error('CacheProducerKeyRabbitMq', ...args);
        }
    }

    init() {
        this._serviceRedis.init();
    }

    setQueue(queue: string) {
        this._queue = queue;
    }

    getKeyMain() {
        if (!this._queue) {
            this.logError('Chưa thiết lập key');
            return;
        }

        const key_main = `${prefix_cache_producerKeyRabbitMq.key.main}_key${this._queue}`;

        return key_main;
    }

    getKeyCacheKeys() {
        const key_cache_keys = `${prefix_cache_producerKeyRabbitMq.key.cache_keys}`;
        return key_cache_keys;
    }

    getTimeExpireat() {
        const timeExpireat = prefix_cache_producerKeyRabbitMq.time;
        return timeExpireat;
    }

    async setKey(key: string) {
        const key_main = this.getKeyMain();
        const timeExpireat = this.getTimeExpireat();
        const key_cache_keys = this.getKeyCacheKeys();

        if (!key_main) {
            this.logError('Lấy key_main không thành công');
            return;
        }

        if (!key_cache_keys) {
            console.error('Lấy key_cache_keys không thành công');
            return;
        }

        const isSet = await this._serviceRedis.setData<string>(key_main, key, timeExpireat);
        if (!isSet) {
            this.logError('Failed to set in Redis', key_main);
        }

        const clientRedis = this._serviceRedis.getClientRedis();
        await clientRedis.sAdd(key_cache_keys, key_main);
        await clientRedis.expire(key_cache_keys, timeExpireat);

        return isSet;
    }

    async getKey() {
        const key_main = this.getKeyMain();

        if (!key_main) {
            this.logError('Lấy key_main không thành công');
            return;
        }

        const key = await this._serviceRedis.getData<string>(key_main);

        return key;
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
