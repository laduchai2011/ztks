import sql from 'mssql';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { GetRequireWithIdBodyField } from '@src/dataStruct/wallet/body';

class QueryDB_GetRequireWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getRequireWithIdBody: GetRequireWithIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetRequireWithIdBody(getRequireWithIdBody: GetRequireWithIdBodyField): void {
        this._getRequireWithIdBody = getRequireWithIdBody;
    }

    async run(): Promise<sql.IProcedureResult<RequireTakeMoneyField> | void> {
        if (this._connectionPool !== undefined && this._getRequireWithIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._getRequireWithIdBody.id)
                    .execute('GetRequireWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetRequireWithId;
