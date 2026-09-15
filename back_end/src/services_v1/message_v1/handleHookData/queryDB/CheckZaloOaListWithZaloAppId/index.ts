import sql from 'mssql';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { CheckZaloOaListWithZaloAppIdBodyField } from '@src/dataStruct/zalo/body';

class QueryDB_CheckZaloOaListWithZaloAppId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _checkZaloOaListWithZaloAppIdBody: CheckZaloOaListWithZaloAppIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCheckZaloOaListWithZaloAppIdBody(checkZaloOaListWithZaloAppIdBody: CheckZaloOaListWithZaloAppIdBodyField): void {
        this._checkZaloOaListWithZaloAppIdBody = checkZaloOaListWithZaloAppIdBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloOaField[]> | void> {
        if (this._connectionPool !== undefined && this._checkZaloOaListWithZaloAppIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('zaloAppId', sql.Int, this._checkZaloOaListWithZaloAppIdBody.zaloAppId)
                    .execute('CheckZaloOaListWithZaloAppId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_CheckZaloOaListWithZaloAppId;
