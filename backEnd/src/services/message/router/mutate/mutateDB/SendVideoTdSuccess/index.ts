import sql from 'mssql';
import { MutateDB } from '@src/services/message/interface';
import { MessageField, SendVideoTdSuccessBodyField } from '@src/dataStruct/message';

class MutateDB_SendVideoTdSuccess extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _sendVideoTdSuccessBody: SendVideoTdSuccessBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setSendVideoTdSuccessBody(sendVideoTdSuccessBody: SendVideoTdSuccessBodyField): void {
        this._sendVideoTdSuccessBody = sendVideoTdSuccessBody;
    }

    async run(): Promise<sql.IProcedureResult<MessageField> | undefined> {
        if (this._connectionPool !== undefined && this._sendVideoTdSuccessBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._sendVideoTdSuccessBody.id)
                    .input('message', sql.NVarChar(sql.MAX), this._sendVideoTdSuccessBody.message)
                    .execute('SendVideoTdSuccess');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_SendVideoTdSuccess;
