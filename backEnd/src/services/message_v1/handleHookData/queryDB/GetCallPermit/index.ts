import sql from 'mssql';
import { CallPerMitField } from '@src/dataStruct/callAgent';
import { GetCallPermitWithUidBodyField } from '@src/dataStruct/callAgent/body';

class QueryDB_GetCallPermitWithAccountId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getCallPermitWithUidBody: GetCallPermitWithUidBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetCallPermitWithUidBody(getCallPermitWithUidBody: GetCallPermitWithUidBodyField): void {
        this._getCallPermitWithUidBody = getCallPermitWithUidBody;
    }

    async run(): Promise<sql.IProcedureResult<CallPerMitField> | undefined> {
        if (this._connectionPool !== undefined && this._getCallPermitWithUidBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('uid', sql.Int, this._getCallPermitWithUidBody.uid)
                    .execute('GetCallPermitWithUid');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetCallPermitWithAccountId;
