import sql from 'mssql';
import { AgentField } from '@src/dataStruct/agent';

class QueryDB_GetAgentWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _id: number | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setId(id: number): void {
        this._id = id;
    }

    async run(): Promise<sql.IProcedureResult<AgentField> | void> {
        if (this._connectionPool !== undefined && this._id !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._id)
                    .execute('GetAgentWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAgentWithId;
