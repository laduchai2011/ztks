import sql from 'mssql';
import { ChatRoomRoleField } from '@src/data_struct/chat_room';
import { ChatRoomRoleWithCridAaidBodyField } from '@src/data_struct/chat_room/body';

class QueryDB_GetChatRoomRoleWithCridAaid {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _chatRoomRoleWithCridAaidBody: ChatRoomRoleWithCridAaidBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setChatRoomRoleWithCridAaidBody(chatRoomRoleWithCridAaidBody: ChatRoomRoleWithCridAaidBodyField): void {
        this._chatRoomRoleWithCridAaidBody = chatRoomRoleWithCridAaidBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomRoleField> | void> {
        if (this._connectionPool !== undefined && this._chatRoomRoleWithCridAaidBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('authorizedAccountId', sql.Int, this._chatRoomRoleWithCridAaidBody.authorizedAccountId)
                    .input('chatRoomId', sql.Int, this._chatRoomRoleWithCridAaidBody.chatRoomId)
                    .execute('GetChatRoomRoleWithCridAaid');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetChatRoomRoleWithCridAaid;
