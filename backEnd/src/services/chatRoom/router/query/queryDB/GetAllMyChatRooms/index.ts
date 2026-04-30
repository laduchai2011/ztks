import sql from 'mssql';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { GetAllMyChatRoomsBodyField } from '@src/dataStruct/chatRoom/body';

class QueryDB_GetAllMyChatRooms {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getAllMyChatRoomsBody: GetAllMyChatRoomsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetAllMyChatRoomsBody(getAllMyChatRoomsBody: GetAllMyChatRoomsBodyField): void {
        this._getAllMyChatRoomsBody = getAllMyChatRoomsBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomField[]> | void> {
        if (this._connectionPool !== undefined && this._getAllMyChatRoomsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._getAllMyChatRoomsBody.accountId)
                    .execute('GetAllMyChatRooms');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAllMyChatRooms;
