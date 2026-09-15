import sql from 'mssql';
import { RegisterPostField } from '@src/dataStruct/post';
import { GetRegisterPostsBodyField } from '@src/dataStruct/post/body';

interface TotalCountField {
    totalCount: number;
}

type RegisterPostsQueryResult = {
    recordsets: [RegisterPostField[], TotalCountField[]];
    recordset: RegisterPostField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetRegisterPosts {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getRegisterPostsBody: GetRegisterPostsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetRegisterPostsBody(getRegisterPostsBody: GetRegisterPostsBodyField): void {
        this._getRegisterPostsBody = getRegisterPostsBody;
    }

    async run(): Promise<RegisterPostsQueryResult | void> {
        if (this._connectionPool !== undefined && this._getRegisterPostsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getRegisterPostsBody.page)
                    .input('size', sql.Int, this._getRegisterPostsBody.size)
                    .input('isDelete', sql.Bit, this._getRegisterPostsBody.isDelete ?? null)
                    .input('accountId', sql.Int, this._getRegisterPostsBody.accountId)
                    .execute('GetRegisterPosts');

                return result as any as RegisterPostsQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetRegisterPosts;
