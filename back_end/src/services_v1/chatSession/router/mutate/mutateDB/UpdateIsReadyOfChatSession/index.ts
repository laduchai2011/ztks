import sql from 'mssql';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { UpdateIsReadyOfChatSessionBodyField } from '@src/dataStruct/chatSession/body';

class MutateDB_UpdateIsReadyOfChatSession {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateIsReadyOfChatSessionBody: UpdateIsReadyOfChatSessionBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateIsReadyOfChatSessionBody(updateIsReadyOfChatSessionBody: UpdateIsReadyOfChatSessionBodyField): void {
        this._updateIsReadyOfChatSessionBody = updateIsReadyOfChatSessionBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatSessionField> | undefined> {
        if (this._connectionPool !== undefined && this._updateIsReadyOfChatSessionBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._updateIsReadyOfChatSessionBody.id)
                    .input('isReady', sql.Bit, this._updateIsReadyOfChatSessionBody.isReady)
                    .input('accountId', sql.Int, this._updateIsReadyOfChatSessionBody.accountId)
                    .execute('UpdateIsReadyOfChatSession');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateIsReadyOfChatSession;
