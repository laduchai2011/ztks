import sql from 'mssql';
import { AccountField } from '@src/dataStruct/account';
import { GetReplyAccountBodyField } from '@src/dataStruct/account/body';

interface TotalCountField {
    totalCount: number;
}

type AccountQueryResult = {
    recordsets: [AccountField[], TotalCountField[]];
    recordset: AccountField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetReplyAccount {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getReplyAccountBody: GetReplyAccountBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetReplyAccountBody(getReplyAccountBody: GetReplyAccountBodyField): void {
        this._getReplyAccountBody = getReplyAccountBody;
    }

    async run(): Promise<AccountQueryResult | void> {
        if (this._connectionPool !== undefined && this._getReplyAccountBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getReplyAccountBody.page)
                    .input('size', sql.Int, this._getReplyAccountBody.size)
                    .input('chatRoomId', sql.Int, this._getReplyAccountBody.chatRoomId)
                    .execute('GetReplyAccounts');

                return result as any as AccountQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetReplyAccount;
