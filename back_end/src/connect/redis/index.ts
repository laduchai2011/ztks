import dotenv from 'dotenv';
import { createClient, RedisClientType } from 'redis';
import { redis_config } from '@src/config';
import my_interface from '@src/interface';
import { my_log } from '@src/log';

dotenv.config();

class REDIS_Server {
    private static instance: REDIS_Server;
    private _redisClient!: RedisClientType;
    private _initPromise: Promise<void> | null = null;

    private constructor() {}

    static getInstance(): REDIS_Server {
        if (!REDIS_Server.instance) {
            REDIS_Server.instance = new REDIS_Server();
        }
        return REDIS_Server.instance;
    }

    async init(): Promise<void> {
        if (this._redisClient) return;
        if (this._initPromise) return this._initPromise;

        this._initPromise = (async () => {
            try {
                const redisConfig = `redis://${redis_config?.username}:${redis_config?.password}@${redis_config?.host}:${redis_config?.port}`;
                this._redisClient = createClient({
                    url: redisConfig,
                    socket: {
                        keepAlive: 5000,
                        reconnectStrategy: (retries) => {
                            my_log.withYellow(`Redis reconnect attempt #${retries}`);
                            return Math.min(retries * 100, 3000);
                        },
                    },
                });

                this._redisClient.on('error', (err) => {
                    console.error('Redis Client Error', err);
                });

                await this._redisClient.connect();
                my_log.withGreen('REDIS_Server connected successfully!');
            } catch (err) {
                console.error('Redis connection failed:', err);
                this._initPromise = null;
                throw err;
            }
        })();

        return this._initPromise;
    }

    get_myConfig(): my_interface['redis']['config'] {
        return redis_config;
    }

    get_client(): RedisClientType {
        return this._redisClient;
    }

    async close(): Promise<void> {
        if (this._redisClient) {
            await this._redisClient.quit();
        }
    }
}

export default REDIS_Server;
