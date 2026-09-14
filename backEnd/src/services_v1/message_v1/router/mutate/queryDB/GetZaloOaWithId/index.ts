import sql from 'mssql';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { ZaloOaWithIdBodyField } from '@src/dataStruct/zalo/body';

class QueryDB_GetZaloOaWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _zaloOaWithIdBody: ZaloOaWithIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setZaloOaWithIdBody(zaloOaWithIdBody: ZaloOaWithIdBodyField): void {
        this._zaloOaWithIdBody = zaloOaWithIdBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloOaField> | void> {
        if (this._connectionPool !== undefined && this._zaloOaWithIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._zaloOaWithIdBody.id)
                    .input('accountId', sql.Int, this._zaloOaWithIdBody.accountId)
                    .execute('GetZaloOaWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetZaloOaWithId;
