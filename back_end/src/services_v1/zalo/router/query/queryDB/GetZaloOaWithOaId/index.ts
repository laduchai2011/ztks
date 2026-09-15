import sql from 'mssql';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { GetZaloOaWithOaIdBodyField } from '@src/dataStruct/zalo/body';

class QueryDB_GetZaloOaWithOaId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getZaloOaWithOaIdBody: GetZaloOaWithOaIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetZaloOaWithOaIdBody(getZaloOaWithOaIdBody: GetZaloOaWithOaIdBodyField): void {
        this._getZaloOaWithOaIdBody = getZaloOaWithOaIdBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloOaField> | void> {
        if (this._connectionPool !== undefined && this._getZaloOaWithOaIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('oaId', sql.NVarChar(255), this._getZaloOaWithOaIdBody.oaId)
                    .input('accountId', sql.Int, this._getZaloOaWithOaIdBody.accountId)
                    .execute('GetZaloOaWithOaId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetZaloOaWithOaId;
