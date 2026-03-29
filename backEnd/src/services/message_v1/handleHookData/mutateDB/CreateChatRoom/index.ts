import sql from 'mssql';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { ChatRoomBodyField } from '@src/dataStruct/chatRoom/body';

class MutateDB_CreateChatRoom {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _chatRoomBody: ChatRoomBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setChatRoomBody(chatRoomBody: ChatRoomBodyField): void {
        this._chatRoomBody = chatRoomBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomField> | undefined> {
        if (this._connectionPool !== undefined && this._chatRoomBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('userIdByApp', sql.NVarChar(255), this._chatRoomBody.userIdByApp)
                    .input('zaloOaId', sql.Int, this._chatRoomBody.zaloOaId)
                    .input('accountId', sql.Int, this._chatRoomBody.accountId)
                    .execute('CreateChatRoom');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateChatRoom;
