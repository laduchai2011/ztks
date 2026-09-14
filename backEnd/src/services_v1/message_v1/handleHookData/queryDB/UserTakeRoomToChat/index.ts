import sql from 'mssql';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { UserTakeRoomToChatBodyField } from '@src/dataStruct/chatRoom/body';

class QueryDB_UserTakeRoomToChat {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _userTakeRoomToChatBody: UserTakeRoomToChatBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUserTakeRoomToChatBody(userTakeRoomToChatBody: UserTakeRoomToChatBodyField): void {
        this._userTakeRoomToChatBody = userTakeRoomToChatBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomField> | void> {
        if (this._connectionPool !== undefined && this._userTakeRoomToChatBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('userIdByApp', sql.NVarChar(255), this._userTakeRoomToChatBody.userIdByApp)
                    .input('zaloOaId', sql.Int, this._userTakeRoomToChatBody.zaloOaId)
                    .execute('UserTakeRoomToChat');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_UserTakeRoomToChat;
