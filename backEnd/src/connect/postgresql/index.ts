import { Pool } from 'pg';
import { postgresql_config } from '@src/config';

export const pool = new Pool({
    host: postgresql_config?.host,
    port: postgresql_config?.port,
    user: postgresql_config?.user,
    password: postgresql_config?.password,
    database: postgresql_config?.database,

    // Số connection tối đa trong pool
    max: 20,

    // Đóng connection idle sau 30 giây
    idleTimeoutMillis: 30_000,

    // Timeout khi kết nối
    connectionTimeoutMillis: 10_000,
});

// kiểm tra connection
pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL error:', err);
});
