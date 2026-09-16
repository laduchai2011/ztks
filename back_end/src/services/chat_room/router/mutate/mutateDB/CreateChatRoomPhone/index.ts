import sql from 'mssql';
import { ChatRoomPhoneField } from '@src/dataStruct/chatRoom';
import { CreateChatRoomPhoneBodyField } from '@src/dataStruct/chatRoom/body';

class MutateDB_CreateChatRoomPhone {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createChatRoomPhoneBody: CreateChatRoomPhoneBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateChatRoomPhoneBody(createChatRoomPhoneBody: CreateChatRoomPhoneBodyField): void {
        this._createChatRoomPhoneBody = createChatRoomPhoneBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomPhoneField> | undefined> {
        if (this._connectionPool !== undefined && this._createChatRoomPhoneBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('phone', sql.NVarChar(15), this._createChatRoomPhoneBody.phone)
                    .input('chatRoomId', sql.Int, this._createChatRoomPhoneBody.chatRoomId)
                    .input('accountId', sql.Int, this._createChatRoomPhoneBody.accountId)
                    .execute('CreateChatRoomPhone');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateChatRoomPhone;
