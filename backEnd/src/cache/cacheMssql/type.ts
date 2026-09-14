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

export interface Cache_Redis_Field {
    id: string;
    key: string;
    value: string;
    update_time: string;
    create_time: string;
}

export interface Res_Postgresql_Cache_Redis_Field {
    log_in_here?: string;
    message: string;
    is_success: boolean;
    data?: Cache_Redis_Field;
    error?: any;
}
