import sql from 'mssql';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { PlaywightGetZaloAppBodyField } from '@src/dataStruct/zalo/body';

class QueryDB_PlaywightGetZaloApp {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _playwightGetZaloAppBody: PlaywightGetZaloAppBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setPlaywightGetZaloAppBody(playwightGetZaloAppBody: PlaywightGetZaloAppBodyField): void {
        this._playwightGetZaloAppBody = playwightGetZaloAppBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloAppField> | void> {
        if (this._connectionPool !== undefined && this._playwightGetZaloAppBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('userName', sql.NVarChar(100), this._playwightGetZaloAppBody.userName)
                    .input('password', sql.NVarChar(100), this._playwightGetZaloAppBody.password)
                    .execute('PlaywightGetZaloApp');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_PlaywightGetZaloApp;
