import sql from 'mssql';
import { ZaloOaTokenField } from '@src/dataStruct/zalo';
import { ZaloOaTokenBodyField } from '@src/dataStruct/zalo/body';

class MutateDB_CreateZaloOaTokenWithFk {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _zaloOaTokenBody: ZaloOaTokenBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setZaloOaTokenBody(zaloOaTokenBody: ZaloOaTokenBodyField): void {
        this._zaloOaTokenBody = zaloOaTokenBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloOaTokenField> | void> {
        if (this._connectionPool !== undefined && this._zaloOaTokenBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('refreshToken', sql.NVarChar(sql.MAX), this._zaloOaTokenBody.refreshToken)
                    .input('zaloOaId', sql.Int, this._zaloOaTokenBody.zaloOaId)
                    .execute('CreateZaloOaToken');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateZaloOaTokenWithFk;
