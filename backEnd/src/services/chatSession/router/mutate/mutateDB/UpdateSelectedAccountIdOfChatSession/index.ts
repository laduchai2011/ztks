import sql from 'mssql';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { UpdateSelectedAccountIdOfChatSessionBodyField } from '@src/dataStruct/chatSession/body';

class MutateDB_UpdateSelectedAccountIdOfChatSession {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateSelectedAccountIdOfChatSessionBody: UpdateSelectedAccountIdOfChatSessionBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateSelectedAccountIdOfChatSessionBody(
        updateSelectedAccountIdOfChatSessionBody: UpdateSelectedAccountIdOfChatSessionBodyField
    ): void {
        this._updateSelectedAccountIdOfChatSessionBody = updateSelectedAccountIdOfChatSessionBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatSessionField> | undefined> {
        if (this._connectionPool !== undefined && this._updateSelectedAccountIdOfChatSessionBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._updateSelectedAccountIdOfChatSessionBody.id)
                    .input(
                        'selectedAccountId',
                        sql.Int,
                        this._updateSelectedAccountIdOfChatSessionBody.selectedAccountId
                    )
                    .input('accountId', sql.Int, this._updateSelectedAccountIdOfChatSessionBody.accountId)
                    .execute('UpdateSelectedAccountIdOfChatSession');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateSelectedAccountIdOfChatSession;
