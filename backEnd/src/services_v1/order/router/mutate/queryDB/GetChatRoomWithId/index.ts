import sql from 'mssql';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { GetChatRoomWithIdBodyField } from '@src/dataStruct/chatRoom/body';

class QueryDB_GetChatRoomWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getChatRoomWithIdBody: GetChatRoomWithIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetChatRoomWithIdBody(getChatRoomWithIdBody: GetChatRoomWithIdBodyField): void {
        this._getChatRoomWithIdBody = getChatRoomWithIdBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomField> | void> {
        if (this._connectionPool !== undefined && this._getChatRoomWithIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._getChatRoomWithIdBody.id)
                    .execute('GetChatRoomWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetChatRoomWithId;
