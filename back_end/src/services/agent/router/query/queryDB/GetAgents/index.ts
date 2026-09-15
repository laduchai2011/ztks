import sql from 'mssql';
import { AgentField } from '@src/dataStruct/agent';
import { GetAgentsBodyField } from '@src/dataStruct/agent/body';

interface TotalCountField {
    totalCount: number;
}

type AgentQueryResult = {
    recordsets: [AgentField[], TotalCountField[]];
    recordset: AgentField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetAgents {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getAgentsBody: GetAgentsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetAgentsBody(getAgentsBody: GetAgentsBodyField): void {
        this._getAgentsBody = getAgentsBody;
    }

    async run(): Promise<AgentQueryResult | void> {
        if (this._connectionPool !== undefined && this._getAgentsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getAgentsBody.page)
                    .input('size', sql.Int, this._getAgentsBody.size)
                    .input('offset', sql.Int, this._getAgentsBody.offset)
                    .input('agentAccountId', sql.Int, this._getAgentsBody.agentAccountId ?? null)
                    .input('accountId', sql.Int, this._getAgentsBody.accountId)
                    .execute('GetAgents');

                return result as any as AgentQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAgents;
