import sql from 'mssql';
import { ChatRoomPhoneField } from '@src/dataStruct/chatRoom';
import { GetListChatRoomPhonesBodyField } from '@src/dataStruct/chatRoom/body';

interface TotalCountField {
    totalCount: number;
}

type ChatRoomPhoneQueryResult = {
    recordsets: [ChatRoomPhoneField[], TotalCountField[]];
    recordset: ChatRoomPhoneField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetListChatRoomPhones {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getListChatRoomPhonesBody: GetListChatRoomPhonesBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetListChatRoomPhonesBody(getListChatRoomPhonesBody: GetListChatRoomPhonesBodyField): void {
        this._getListChatRoomPhonesBody = getListChatRoomPhonesBody;
    }

    async run(): Promise<ChatRoomPhoneQueryResult | void> {
        if (this._connectionPool !== undefined && this._getListChatRoomPhonesBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('chatRoomId', sql.Int, this._getListChatRoomPhonesBody.chatRoomId)
                    .input('accountId', sql.Int, this._getListChatRoomPhonesBody.accountId)
                    .execute('GetListChatRoomPhones');

                return result as unknown as ChatRoomPhoneQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetListChatRoomPhones;
