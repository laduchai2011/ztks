import sql from 'mssql';
import { AccountField } from '@src/dataStruct/account';
import { GetReplyAccountBodyField, GetNotReplyAccountBodyField } from '@src/dataStruct/account/body';

interface TotalCountField {
    totalCount: number;
}

type AccountQueryResult = {
    recordsets: [AccountField[], TotalCountField[]];
    recordset: AccountField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetNotReplyAccount {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getNotReplyAccountBody: GetNotReplyAccountBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetNotReplyAccountBody(getNotReplyAccountBody: GetNotReplyAccountBodyField): void {
        this._getNotReplyAccountBody = getNotReplyAccountBody;
    }

    async run(): Promise<AccountQueryResult | void> {
        if (this._connectionPool !== undefined && this._getNotReplyAccountBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getNotReplyAccountBody.page)
                    .input('size', sql.Int, this._getNotReplyAccountBody.size)
                    .input('chatRoomId', sql.Int, this._getNotReplyAccountBody.chatRoomId)
                    .input('accountId', sql.Int, this._getNotReplyAccountBody.accountId)
                    .execute('GetNotReplyAccounts');

                return result as any as AccountQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetNotReplyAccount;
