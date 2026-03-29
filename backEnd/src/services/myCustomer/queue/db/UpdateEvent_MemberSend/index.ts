import sql from 'mssql';
import { MutateDB } from '@src/services/myCustomer/interface';
import { MessageField, UpdateEventMemberSendBodyField } from '@src/dataStruct/message';

class MutateDB_UpdateEvent_MemberSend extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateEventMemberSendBody: UpdateEventMemberSendBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateEventMemberSendBody(updateEventMemberSendBody: UpdateEventMemberSendBodyField): void {
        this._updateEventMemberSendBody = updateEventMemberSendBody;
    }

    async run(): Promise<sql.IProcedureResult<MessageField> | undefined> {
        if (this._connectionPool !== undefined && this._updateEventMemberSendBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('eventName', sql.NVarChar(255), this._updateEventMemberSendBody.eventName)
                    .input('receiveId', sql.NVarChar(255), this._updateEventMemberSendBody.receiveId)
                    .input('timestamp', sql.NVarChar(255), this._updateEventMemberSendBody.timestamp)
                    .input('messageStatus', sql.NVarChar(255), this._updateEventMemberSendBody.messageStatus)
                    .input('accountId', sql.Int, this._updateEventMemberSendBody.accountId)
                    .execute('UpdateEvent_MemberSend');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateEvent_MemberSend;
