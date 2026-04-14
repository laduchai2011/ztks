import sql from 'mssql';
import { mssql_server } from '@src/connect';
import { ResMssqlCacheRedisField, CacheRedisField } from './type';

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
        res.message = 'Lỗi Cập nhật dữ liệu vào MSSQL !';
        res.error = error;
        return res;
    }
}
