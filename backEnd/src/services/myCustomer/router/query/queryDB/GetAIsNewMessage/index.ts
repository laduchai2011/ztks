import sql from 'mssql';
import { QueryDB } from '@src/services/myCustomer/interface';
import { IsNewMessageBodyField, IsNewMessageField } from '@src/dataStruct/myCustomer';

class QueryDB_GetAIsNewMessage extends QueryDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _isNewMessageBody: IsNewMessageBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setIsNewMessageBody(isNewMessageBody: IsNewMessageBodyField): void {
        this._isNewMessageBody = isNewMessageBody;
    }

    async run(): Promise<sql.IProcedureResult<IsNewMessageField> | void> {
        if (this._connectionPool !== undefined && this._isNewMessageBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('myCustomerId', sql.Int, this._isNewMessageBody.myCustomerId)
                    .execute('GetAIsNewMessage');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAIsNewMessage;
