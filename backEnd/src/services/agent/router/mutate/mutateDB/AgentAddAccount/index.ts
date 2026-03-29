import sql from 'mssql';
import { AgentField } from '@src/dataStruct/agent';
import { AgentAddAccountBodyField } from '@src/dataStruct/agent/body';

class MutateDB_AgentAddAccount {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _agentAddAccountBody: AgentAddAccountBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setAgentAddAccountBody(agentAddAccountBody: AgentAddAccountBodyField): void {
        this._agentAddAccountBody = agentAddAccountBody;
    }

    async run(): Promise<sql.IProcedureResult<AgentField> | undefined> {
        if (this._connectionPool !== undefined && this._agentAddAccountBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._agentAddAccountBody.id)
                    .input('agentAccountId', sql.Int, this._agentAddAccountBody.agentAccountId ?? null)
                    .input('accountId', sql.Int, this._agentAddAccountBody.accountId)
                    .execute('AgentAddAccount');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_AgentAddAccount;
