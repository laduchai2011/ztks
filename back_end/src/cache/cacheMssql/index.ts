import sql from 'mssql';
import { pool } from '@src/connect/postgresql';
import { mssql_server } from '@src/connect';
import { ResMssqlCacheRedisField, CacheRedisField, Res_Postgresql_Cache_Redis_Field, Cache_Redis_Field } from './type';

mssql_server.init();

export async function mssqlGetValue(key: string): Promise<ResMssqlCacheRedisField> {
    const res: ResMssqlCacheRedisField = {
        logInHere: `mssqlGetValue - ${key}`,
        message: 'Bắt đầu !',
        isSuccess: false,
    };

    const connection_pool = mssql_server.get_connectionPool();

    if (!connection_pool) {
        res.message = 'Kết nối MSSQL không thành công (connection_pool chưa có) !';
        return res;
    }

    try {
        const result = await connection_pool
            .request()
            .input('key', sql.NVarChar(255), key)
            .execute('GetACacheRedisWithKey');

        if (result?.recordset.length && result?.recordset.length > 0) {
            res.isSuccess = true;
            res.message = 'Lấy dữ liệu từ MSSQL thành công !';
            res.data = result.recordset[0] as CacheRedisField;
            return res;
        } else {
            res.message = 'Không có dữ liệu nào từ sql !';
            return res;
        }
    } catch (error) {
        res.message = 'Lỗi lấy dữ liệu từ MSSQL !';
        res.error = error;
        return res;
    }
}

export async function mssqlSetValue(key: string, value: string): Promise<ResMssqlCacheRedisField> {
    const res: ResMssqlCacheRedisField = {
        logInHere: `mssqlSetValue - ${key}`,
        message: 'Bắt đầu !',
        isSuccess: false,
    };

    const connection_pool = mssql_server.get_connectionPool();

    if (!connection_pool) {
        res.message = 'Kết nối MSSQL không thành công (connection_pool chưa có) !';
        return res;
    }

    try {
        const result = await connection_pool
            .request()
            .input('key', sql.NVarChar(255), key)
            .input('value', sql.NVarChar(sql.MAX), value)
            .execute('CreateCacheRedis');

        if (result?.recordset.length && result?.recordset.length > 0) {
            res.isSuccess = true;
            res.message = 'Ghi dữ liệu vào MSSQL thành công !';
            res.data = result.recordset[0] as CacheRedisField;
            return res;
        } else {
            res.message = 'Không ghi được dữ liệu vào sql !';
            return res;
        }
    } catch (error) {
        res.message = 'Lỗi ghi dữ liệu vào MSSQL !';
        res.error = error;
        return res;
    }
}

export async function mssqlUpdateValue(key: string, value: string): Promise<ResMssqlCacheRedisField> {
    const res: ResMssqlCacheRedisField = {
        logInHere: `mssqlUpdateValue - ${key}`,
        message: 'Bắt đầu !',
        isSuccess: false,
    };

    const connection_pool = mssql_server.get_connectionPool();

    if (!connection_pool) {
        res.message = 'Kết nối MSSQL không thành công (connection_pool chưa có) !';
        return res;
    }

    try {
        const result = await connection_pool
            .request()
            .input('key', sql.NVarChar(255), key)
            .input('value', sql.NVarChar(sql.MAX), value)
            .execute('UpdateValue_CacheRedis');

        if (result?.recordset.length && result?.recordset.length > 0) {
            res.isSuccess = true;
            res.message = 'Cập nhật dữ liệu vào MSSQL thành công !';
            res.data = result.recordset[0] as CacheRedisField;
            return res;
        } else {
            res.message = 'Không cập nhật được dữ liệu vào sql !';
            return res;
        }
    } catch (error) {
        res.message = 'Lỗi cập nhật dữ liệu vào MSSQL !';
        res.error = error;
        return res;
    }
}

export async function mssqlDeleteCacheRedisWithKey(key: string): Promise<boolean> {
    const connection_pool = mssql_server.get_connectionPool();

    if (!connection_pool) {
        return false;
    }

    try {
        const result = await connection_pool
            .request()
            .input('key', sql.NVarChar(255), key)
            .execute<boolean>('DeleteCacheRedisWithKey');

        return result.recordset[0];
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function postgresql_get_value(key: string): Promise<Res_Postgresql_Cache_Redis_Field> {
    const res: Res_Postgresql_Cache_Redis_Field = {
        log_in_here: `postgresql_get_value - ${key}`,
        message: 'Bắt đầu !',
        is_success: false,
    };

    try {
        const result = await pool.query<Cache_Redis_Field>(`SELECT * FROM get_a_cache_redis_with_key($1);`, [key]);

        res.is_success = true;
        res.message = 'Lấy dữ liệu từ POSTGRESQL thành công !';
        res.data = result.rows[0];
        return res;
    } catch (error) {
        res.message = 'Lỗi lấy dữ liệu từ POSTGRESQL !';
        res.error = error;
        return res;
    }
}

export async function postgresql_set_value(key: string, value: string): Promise<Res_Postgresql_Cache_Redis_Field> {
    const res: Res_Postgresql_Cache_Redis_Field = {
        log_in_here: `postgresql_set_value - ${key}`,
        message: 'Bắt đầu !',
        is_success: false,
    };

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await pool.query<Cache_Redis_Field>(`SELECT * FROM create_cache_redis($1, $2);`, [key, value]);

        await client.query('COMMIT');

        res.is_success = true;
        res.message = 'Lấy dữ liệu từ POSTGRESQL thành công !';
        res.data = result.rows[0];
        return res;
    } catch (error) {
        await client.query('ROLLBACK');
        res.message = 'Lỗi ghi dữ liệu vào POSTGRESQL !';
        res.error = error;
        return res;
    } finally {
        client.release();
    }
}

export async function postgresql_update_value(key: string, value: string): Promise<Res_Postgresql_Cache_Redis_Field> {
    const res: Res_Postgresql_Cache_Redis_Field = {
        log_in_here: `postgresql_update_value - ${key}`,
        message: 'Bắt đầu !',
        is_success: false,
    };

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await pool.query<Cache_Redis_Field>(`SELECT * FROM update_value_cache_redis($1, $2);`, [
            key,
            value,
        ]);

        await client.query('COMMIT');

        res.is_success = true;
        res.message = 'Lấy dữ liệu từ POSTGRESQL thành công !';
        res.data = result.rows[0];
        return res;
    } catch (error) {
        res.message = 'Lỗi cập nhật dữ liệu vào POSTGRESQL !';
        res.error = error;
        return res;
    } finally {
        client.release();
    }
}

export async function postgresql_delete_cache_redis_with_key(key: string): Promise<boolean> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await pool.query<{ r: boolean }>(`SELECT * FROM delete_cache_redis_with_key($1);`, [key]);

        await client.query('COMMIT');

        return result.rows[0].r;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        client.release();
    }
}
