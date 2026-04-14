import { default as Redlock, ResourceLockedError } from 'redlock';
import Redis from 'ioredis';
import { redis_config } from '@src/config';

// Base Redis URL
const baseURL_shopm: string = `redis://${redis_config?.username}:${redis_config?.password}@${redis_config?.host}:${redis_config?.port}`;

// Tạo Redis client
// const redisLockClient = new Redis(baseURL_shopm);
const redisLockClient = new Redis(baseURL_shopm, {
    maxRetriesPerRequest: null, // 🔥 BẮT BUỘC
    enableReadyCheck: true,
    retryStrategy(times) {
        return Math.min(times * 100, 2000);
    },
});

redisLockClient.on('connect', () => {
    console.log('Redis Lock client connected');
});

redisLockClient.on('reconnecting', () => {
    console.warn('Redis Lock client reconnecting...');
});

redisLockClient.on('error', (err) => {
    console.error('Redis Lock client error:', err.message);
});

// Tạo Redlock instance
const serviceRedlock = new Redlock(
    [redisLockClient], // single Redis instance
    {
        driftFactor: 0.01,
        retryCount: 10, // -1 = retry vô hạn
        retryDelay: 100, // mỗi lần retry cách nhau 100ms
        retryJitter: 200, // ngẫu nhiên thêm 0–200ms
        automaticExtensionThreshold: 500, // nếu TTL gần hết, tự gia hạn
    }
);

// Bắt sự kiện lỗi
serviceRedlock.on('error', (error: unknown) => {
    if (error instanceof ResourceLockedError) {
        return; // lock đã bị giữ, có thể bỏ qua
    }
});

// Export kiểu rõ ràng
export { serviceRedlock };
