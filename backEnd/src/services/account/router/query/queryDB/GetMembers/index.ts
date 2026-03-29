import sql from 'mssql';
import { AccountField } from '@src/dataStruct/account';
import { GetMembersBodyField } from '@src/dataStruct/account/body';

interface TotalCountField {
    totalCount: number;
}

type AccountQueryResult = {
    recordsets: [AccountField[], TotalCountField[]];
    recordset: AccountField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetMembers {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getMembersBody: GetMembersBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetMembersBody(getMembersBody: GetMembersBodyField): void {
        this._getMembersBody = getMembersBody;
    }

    async run(): Promise<AccountQueryResult | void> {
        if (this._connectionPool !== undefined && this._getMembersBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getMembersBody.page)
                    .input('size', sql.Int, this._getMembersBody.size)
                    .input('searchedAccountId', sql.Int, this._getMembersBody.searchedAccountId ?? null)
                    .input('accountId', sql.Int, this._getMembersBody.accountId)
                    .execute('GetMembers');

                return result as any as AccountQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMembers;
