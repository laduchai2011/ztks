import sql from 'mssql';
import { AgentField } from '@src/dataStruct/agent';
import { CreateAgentBodyField } from '@src/dataStruct/agent/body';

class MutateDB_CreateAgent {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createAgentBody: CreateAgentBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateAgentBody(createAgentBody: CreateAgentBodyField): void {
        this._createAgentBody = createAgentBody;
    }

    async run(): Promise<sql.IProcedureResult<AgentField> | undefined> {
        if (this._connectionPool !== undefined && this._createAgentBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._createAgentBody.accountId)
                    .execute('CreateAgent');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateAgent;
