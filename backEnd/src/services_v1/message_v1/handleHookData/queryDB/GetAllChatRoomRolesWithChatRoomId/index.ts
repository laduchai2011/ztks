import sql from 'mssql';
import { ChatRoomRoleField } from '@src/dataStruct/chatRoom';

class QueryDB_GetAllChatRoomRolesWithChatRoomId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _chatRoomId: number | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setChatRoomId(chatRoomId: number): void {
        this._chatRoomId = chatRoomId;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomRoleField[]> | void> {
        if (this._connectionPool !== undefined && this._chatRoomId !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('chatRoomId', sql.Int, this._chatRoomId)
                    .execute('GetAllChatRoomRolesWithChatRoomId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAllChatRoomRolesWithChatRoomId;
