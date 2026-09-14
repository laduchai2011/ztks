import sql from 'mssql';
import { AgentField } from '@src/dataStruct/agent';
import { AgentDelAccountBodyField } from '@src/dataStruct/agent/body';

class MutateDB_AgentDelAccount {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _agentDelAccountBody: AgentDelAccountBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setAgentDelAccountBody(agentDelAccountBody: AgentDelAccountBodyField): void {
        this._agentDelAccountBody = agentDelAccountBody;
    }

    async run(): Promise<sql.IProcedureResult<AgentField> | undefined> {
        if (this._connectionPool !== undefined && this._agentDelAccountBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._agentDelAccountBody.id)
                    .input('accountId', sql.Int, this._agentDelAccountBody.accountId)
                    .execute('AgentDelAccount');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_AgentDelAccount;
