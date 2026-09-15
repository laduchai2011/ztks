import sql from 'mssql';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { GetMyChatRoomsBodyField } from '@src/dataStruct/chatRoom/body';

interface TotalCountField {
    totalCount: number;
}

type ChatRoomQueryResult = {
    recordsets: [ChatRoomField[], TotalCountField[]];
    recordset: ChatRoomField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetMyChatRooms {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getMyChatRoomsBody: GetMyChatRoomsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetMyChatRoomsBody(getMyChatRoomsBody: GetMyChatRoomsBodyField): void {
        this._getMyChatRoomsBody = getMyChatRoomsBody;
    }

    async run(): Promise<ChatRoomQueryResult | void> {
        if (this._connectionPool !== undefined && this._getMyChatRoomsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getMyChatRoomsBody.page)
                    .input('size', sql.Int, this._getMyChatRoomsBody.size)
                    .input('accountId', sql.Int, this._getMyChatRoomsBody.accountId)
                    .execute('GetMyChatRooms');

                return result as unknown as ChatRoomQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMyChatRooms;
