import sql from 'mssql';
import { MutateDB } from '@src/services/message/interface';
import { MessageField, CreateMessageBodyField } from '@src/dataStruct/message';

class MutateDB_CreateMessage extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createMessageBody: CreateMessageBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateMessageBody(createMessageBody: CreateMessageBodyField): void {
        this._createMessageBody = createMessageBody;
    }

    async run(): Promise<sql.IProcedureResult<MessageField> | undefined> {
        if (this._connectionPool !== undefined && this._createMessageBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('eventName', sql.NVarChar(255), this._createMessageBody.eventName)
                    .input('sender', sql.NVarChar(255), this._createMessageBody.sender)
                    .input('senderId', sql.NVarChar(255), this._createMessageBody.senderId)
                    .input('receiveId', sql.NVarChar(255), this._createMessageBody.receiveId)
                    .input('message', sql.NVarChar(sql.MAX), this._createMessageBody.message)
                    .input('type', sql.NVarChar(255), this._createMessageBody.type)
                    .input('timestamp', sql.NVarChar(255), this._createMessageBody.timestamp)
                    .input('messageStatus', sql.NVarChar(255), this._createMessageBody.messageStatus)
                    .input('accountId', sql.Int, this._createMessageBody.accountId)
                    .execute('CreateMessage');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateMessage;
