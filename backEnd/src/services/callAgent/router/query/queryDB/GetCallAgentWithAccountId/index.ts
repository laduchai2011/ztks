import sql from 'mssql';
import { CallAgentField } from '@src/dataStruct/callAgent';
import { GetCallAgentWithAccountIdBodyField } from '@src/dataStruct/callAgent/body';

class QueryDB_GetCallAgentWithAccountId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getCallAgentWithAccountIdBody: GetCallAgentWithAccountIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetCallAgentWithAccountIdBody(getCallAgentWithAccountIdBody: GetCallAgentWithAccountIdBodyField): void {
        this._getCallAgentWithAccountIdBody = getCallAgentWithAccountIdBody;
    }

    async run(): Promise<sql.IProcedureResult<CallAgentField> | undefined> {
        if (this._connectionPool !== undefined && this._getCallAgentWithAccountIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._getCallAgentWithAccountIdBody.accountId)
                    .execute('GetCallAgentWithAccountId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetCallAgentWithAccountId;
