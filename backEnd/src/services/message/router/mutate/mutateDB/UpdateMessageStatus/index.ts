import sql from 'mssql';
import { MutateDB } from '@src/services/message/interface';
import { MessageField, UpdateMessageStatusBodyField } from '@src/dataStruct/message';

class MutateDB_UpdateMessageStatus extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateMessageStatusBody: UpdateMessageStatusBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateMessageStatusBody(updateMessageStatusBody: UpdateMessageStatusBodyField): void {
        this._updateMessageStatusBody = updateMessageStatusBody;
    }

    async run(): Promise<sql.IProcedureResult<MessageField> | undefined> {
        if (this._connectionPool !== undefined && this._updateMessageStatusBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('eventName', sql.NVarChar(255), this._updateMessageStatusBody.eventName)
                    .input('receiveId', sql.NVarChar(255), this._updateMessageStatusBody.receiveId)
                    .input('timestamp', sql.NVarChar(255), this._updateMessageStatusBody.timestamp)
                    .input('messageStatus', sql.NVarChar(255), this._updateMessageStatusBody.messageStatus)
                    .input('accountId', sql.Int, this._updateMessageStatusBody.accountId)
                    .execute('UpdateMessageStatus');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateMessageStatus;
