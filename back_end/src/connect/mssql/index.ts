import dotenv from 'dotenv';
import sql, { config } from 'mssql';
import { mssql_config } from '@src/config';
import my_interface from '@src/interface';
import { my_log } from '@src/log';

dotenv.config();

class MSSQL_Server {
    private static instance: MSSQL_Server;
    private _connectionPool: sql.ConnectionPool | undefined;
    private _initPromise: Promise<void> | null = null;

    private constructor() {}

    static getInstance(): MSSQL_Server {
        if (!MSSQL_Server.instance) {
            MSSQL_Server.instance = new MSSQL_Server();
        }
        return MSSQL_Server.instance;
    }

    async init(): Promise<void> {
        if (this._initPromise) return this._initPromise;

        this._initPromise = (async () => {
            try {
                const sqlConfig: config = {
                    user: mssql_config?.username,
                    password: mssql_config?.password,
                    database: mssql_config?.database,
                    server: mssql_config?.host ? mssql_config?.host : '',
                    port: mssql_config?.port,
                    pool: {
                        max: 10,
                        min: 0,
                        idleTimeoutMillis: 30000,
                    },
                    options: {
                        // encrypt: true, // for azure
                        // trustServerCertificate: false // change to true for local dev / self-signed certs
                        encrypt: false, // Tắt mã hóa
                        trustServerCertificate: true, // Bỏ qua kiểm tra chứng chỉ
                    },
                };

                const pool = new sql.ConnectionPool(sqlConfig);
                this._connectionPool = await pool.connect();
                my_log.withGreen('MSSQL_Server connected successfully!');
            } catch (err) {
                console.error('MSSQL_Server connection failed:', err);
                this._initPromise = null;
                throw err;
            }
        })();

        return this._initPromise;
    }

    get_myConfig(): my_interface['mssql']['config'] {
        return mssql_config;
    }

    get_connectionPool(): sql.ConnectionPool | undefined {
        return this._connectionPool;
    }

    async close(): Promise<void> {
        if (this._connectionPool) {
            await this._connectionPool.close();
            my_log.withYellow('MSSQL_Server connection closed.');
        }
    }
}

export default MSSQL_Server;
