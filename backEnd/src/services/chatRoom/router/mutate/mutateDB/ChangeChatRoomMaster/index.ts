import sql from 'mssql';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { ChangeChatRoomMasterBodyField } from '@src/dataStruct/chatRoom/body';

class MutateDB_ChangeChatRoomMaster {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _changeChatRoomMasterBody: ChangeChatRoomMasterBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setChangeChatRoomMasterBody(changeChatRoomMasterBody: ChangeChatRoomMasterBodyField): void {
        this._changeChatRoomMasterBody = changeChatRoomMasterBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomField> | undefined> {
        if (this._connectionPool !== undefined && this._changeChatRoomMasterBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('chatRoomId', sql.Int, this._changeChatRoomMasterBody.chatRoomId)
                    .input('newAccountId', sql.Int, this._changeChatRoomMasterBody.newAccountId)
                    .input('accountId', sql.Int, this._changeChatRoomMasterBody.accountId)
                    .execute('ChangeChatRoomMaster');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_ChangeChatRoomMaster;
