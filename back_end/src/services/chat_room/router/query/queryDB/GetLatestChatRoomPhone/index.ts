import sql from 'mssql';
import { ChatRoomPhoneField } from '@src/dataStruct/chatRoom';
import { GetLatestChatRoomPhoneBodyField } from '@src/dataStruct/chatRoom/body';

class QueryDB_GetLatestChatRoomPhone {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getLatestChatRoomPhoneBody: GetLatestChatRoomPhoneBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetLatestChatRoomPhoneBody(getLatestChatRoomPhoneBody: GetLatestChatRoomPhoneBodyField): void {
        this._getLatestChatRoomPhoneBody = getLatestChatRoomPhoneBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomPhoneField> | void> {
        if (this._connectionPool !== undefined && this._getLatestChatRoomPhoneBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('chatRoomId', sql.Int, this._getLatestChatRoomPhoneBody.chatRoomId)
                    .input('accountId', sql.Int, this._getLatestChatRoomPhoneBody.accountId)
                    .execute('GetLatestChatRoomPhone');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetLatestChatRoomPhone;
