import sql from 'mssql';
import { AgentPayField } from '@src/dataStruct/agent';
import { GetLastAgentPayBodyField } from '@src/dataStruct/agent/body';

class QueryDB_GetLastAgentPay {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getLastAgentPayBody: GetLastAgentPayBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetLastAgentPayBody(getLastAgentPayBody: GetLastAgentPayBodyField): void {
        this._getLastAgentPayBody = getLastAgentPayBody;
    }

    async run(): Promise<sql.IProcedureResult<AgentPayField> | void> {
        if (this._connectionPool !== undefined && this._getLastAgentPayBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('agentId', sql.Int, this._getLastAgentPayBody.agentId)
                    .input('accountId', sql.Int, this._getLastAgentPayBody.accountId)
                    .execute('GetLastAgentPay');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetLastAgentPay;
