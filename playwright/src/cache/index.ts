import ServiceRedis from './cacheRedis';

const service_redis = ServiceRedis.getInstance();
service_redis.init();

export { service_redis };
