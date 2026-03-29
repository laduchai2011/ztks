import sql from 'mssql';
import { MutateDB } from '@src/services/message/interface';
import { MessageField, SendVideoTdFailureBodyField } from '@src/dataStruct/message';

class MutateDB_SendVideoTdFailure extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _sendVideoTdFailureBody: SendVideoTdFailureBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setSendVideoTdFailureBody(sendVideoTdFailureBody: SendVideoTdFailureBodyField): void {
        this._sendVideoTdFailureBody = sendVideoTdFailureBody;
    }

    async run(): Promise<sql.IProcedureResult<MessageField> | undefined> {
        if (this._connectionPool !== undefined && this._sendVideoTdFailureBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._sendVideoTdFailureBody.id)
                    .execute('SendVideoTdFailure');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_SendVideoTdFailure;
