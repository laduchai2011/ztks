import { pool } from '@src/connect/postgresql';
import { Res_Postgresql_Cache_Redis_Field, Cache_Redis_Field } from './type';

export async function postgresql_Get_Value(key: string): Promise<Res_Postgresql_Cache_Redis_Field> {
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

export async function postgresql_Set_Value(key: string, value: string): Promise<Res_Postgresql_Cache_Redis_Field> {
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

export async function postgresql_Update_Value(key: string, value: string): Promise<Res_Postgresql_Cache_Redis_Field> {
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

export async function postgresql_Delete_Cache_Redis_With_Key(key: string): Promise<boolean> {
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
