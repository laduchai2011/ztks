import sql from 'mssql';
import { ZnsTemplateField } from '@src/dataStruct/zalo';
import { GetZnsTemplateWithIdBodyField } from '@src/dataStruct/zalo/body';

class QueryDB_GetZnsTemplateWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getZnsTemplateWithIdBody: GetZnsTemplateWithIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetZnsTemplateWithIdBody(getZnsTemplateWithIdBody: GetZnsTemplateWithIdBodyField): void {
        this._getZnsTemplateWithIdBody = getZnsTemplateWithIdBody;
    }

    async run(): Promise<sql.IProcedureResult<ZnsTemplateField> | void> {
        if (this._connectionPool !== undefined && this._getZnsTemplateWithIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._getZnsTemplateWithIdBody.id)
                    .input('accountId', sql.Int, this._getZnsTemplateWithIdBody.accountId)
                    .execute('GetZnsTemplateWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetZnsTemplateWithId;
