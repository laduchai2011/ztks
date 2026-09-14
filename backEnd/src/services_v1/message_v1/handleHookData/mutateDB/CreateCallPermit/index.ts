import sql from 'mssql';
import { CallPerMitField } from '@src/dataStruct/callAgent';
import { CreateCallPermitBodyField } from '@src/dataStruct/callAgent/body';

class MutateDB_CreateCallPermit {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createCallPermitBody: CreateCallPermitBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateCallPermitBody(createCallPermitBody: CreateCallPermitBodyField): void {
        this._createCallPermitBody = createCallPermitBody;
    }

    async run(): Promise<sql.IProcedureResult<CallPerMitField> | undefined> {
        if (this._connectionPool !== undefined && this._createCallPermitBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('uid', sql.NVarChar(255), this._createCallPermitBody.uid)
                    .input('appId', sql.NVarChar(255), this._createCallPermitBody.appId)
                    .input('oaId', sql.NVarChar(255), this._createCallPermitBody.oaId)
                    .input('callAgentId', sql.Int, this._createCallPermitBody.callAgentId)
                    .input('accountId', sql.Int, this._createCallPermitBody.accountId)
                    .execute('CreateCallPermit');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateCallPermit;
