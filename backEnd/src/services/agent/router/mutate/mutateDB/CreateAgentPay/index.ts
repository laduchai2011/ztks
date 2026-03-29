import sql from 'mssql';
import { AgentPayField } from '@src/dataStruct/agent';
import { CreateAgentPayBodyField } from '@src/dataStruct/agent/body';

class MutateDB_CreateAgentPay {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createAgentPayBody: CreateAgentPayBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateAgentPayBody(createAgentPayBody: CreateAgentPayBodyField): void {
        this._createAgentPayBody = createAgentPayBody;
    }

    async run(): Promise<sql.IProcedureResult<AgentPayField> | undefined> {
        if (this._connectionPool !== undefined && this._createAgentPayBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('agentId', sql.Int, this._createAgentPayBody.agentId)
                    .input('accountId', sql.Int, this._createAgentPayBody.accountId)
                    .execute('CreateAgentPay');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateAgentPay;
