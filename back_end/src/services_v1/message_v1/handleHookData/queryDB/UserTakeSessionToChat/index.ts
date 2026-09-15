import sql from 'mssql';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { UserTakeSessionToChatBodyField } from '@src/dataStruct/chatSession/body';

class QueryDB_UserTakeSessionToChat {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _userTakeSessionToChatBody: UserTakeSessionToChatBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUserTakeSessionToChatBody(userTakeSessionToChatBody: UserTakeSessionToChatBodyField): void {
        this._userTakeSessionToChatBody = userTakeSessionToChatBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatSessionField> | void> {
        if (this._connectionPool !== undefined && this._userTakeSessionToChatBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('code', sql.NVarChar(255), this._userTakeSessionToChatBody.code)
                    .input('zaloOaId', sql.Int, this._userTakeSessionToChatBody.zaloOaId)
                    .execute('UserTakeSessionToChat');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_UserTakeSessionToChat;
