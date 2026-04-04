import sql from 'mssql';
import { AgentField } from '@src/dataStruct/agent';
import { GetAgentWithAgentAccountIdBodyField } from '@src/dataStruct/agent/body';

class QueryDB_GetAgentWithAgentAccountId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getAgentWithAgentAccountIdBody: GetAgentWithAgentAccountIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetAgentWithAgentAccountIdBody(getAgentWithAgentAccountIdBody: GetAgentWithAgentAccountIdBodyField): void {
        this._getAgentWithAgentAccountIdBody = getAgentWithAgentAccountIdBody;
    }

    async run(): Promise<sql.IProcedureResult<AgentField> | void> {
        if (this._connectionPool !== undefined && this._getAgentWithAgentAccountIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('agentAccountId', sql.Int, this._getAgentWithAgentAccountIdBody.agentAccountId)
                    .execute('GetAgentWithAgentAccountId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAgentWithAgentAccountId;
