import sql from 'mssql';
import { ZaloOaTokenField } from '@src/dataStruct/zalo';
import { GetZaloOaTokenWithFkBodyField } from '@src/dataStruct/zalo/body';

class QueryDB_GetZaloOaTokenWithFk {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getZaloOaTokenWithFkBody: GetZaloOaTokenWithFkBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetZaloOaTokenWithFkBody(getZaloOaTokenWithFkBody: GetZaloOaTokenWithFkBodyField): void {
        this._getZaloOaTokenWithFkBody = getZaloOaTokenWithFkBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloOaTokenField> | void> {
        if (this._connectionPool !== undefined && this._getZaloOaTokenWithFkBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('zaloOaId', sql.Int, this._getZaloOaTokenWithFkBody.zaloOaId)
                    .execute('GetZaloOaTokenWithFk');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetZaloOaTokenWithFk;
