import sql from 'mssql';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { ZaloAppWithAccountIdBodyField } from '@src/dataStruct/zalo/body';

class QueryDB_GetZaloAppWithAccountId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _zaloAppWithAccountIdBody: ZaloAppWithAccountIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setZaloAppWithAccountIdBody(zaloAppWithAccountIdBody: ZaloAppWithAccountIdBodyField): void {
        this._zaloAppWithAccountIdBody = zaloAppWithAccountIdBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloAppField> | void> {
        if (this._connectionPool !== undefined && this._zaloAppWithAccountIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._zaloAppWithAccountIdBody.accountId)
                    .execute('GetZaloAppWithAccountId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetZaloAppWithAccountId;
