import sql from 'mssql';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { CheckZaloAppWithAppIdBodyField } from '@src/dataStruct/zalo/body';

class QueryDB_CheckZaloAppWithAppId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _checkZaloAppWithAppIdBody: CheckZaloAppWithAppIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCheckZaloAppWithAppIdBody(checkZaloAppWithAppIdBody: CheckZaloAppWithAppIdBodyField): void {
        this._checkZaloAppWithAppIdBody = checkZaloAppWithAppIdBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloAppField> | void> {
        if (this._connectionPool !== undefined && this._checkZaloAppWithAppIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('appId', sql.NVarChar(255), this._checkZaloAppWithAppIdBody.appId)
                    .execute('CheckZaloAppWithAppId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_CheckZaloAppWithAppId;
