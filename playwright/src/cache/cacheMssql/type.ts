export interface CacheRedisField {
    id: number;
    key: string;
    value: string;
    updateTime: string;
    createTime: string;
}

export interface ResMssqlCacheRedisField {
    logInHere?: string;
    message: string;
    isSuccess: boolean;
    data?: CacheRedisField;
    error?: any;
}
