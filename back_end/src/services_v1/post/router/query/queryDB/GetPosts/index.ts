import sql from 'mssql';
import { PostField } from '@src/dataStruct/post';
import { GetPostsBodyField } from '@src/dataStruct/post/body';

interface TotalCountField {
    totalCount: number;
}

type PostsQueryResult = {
    recordsets: [PostField[], TotalCountField[]];
    recordset: PostField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetPosts {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getPostsBody: GetPostsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetPostsBody(getPostsBody: GetPostsBodyField): void {
        this._getPostsBody = getPostsBody;
    }

    async run(): Promise<PostsQueryResult | void> {
        if (this._connectionPool !== undefined && this._getPostsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getPostsBody.page)
                    .input('size', sql.Int, this._getPostsBody.size)
                    .input('isActive', sql.Bit, this._getPostsBody.isActive ?? null)
                    .input('registerPostId', sql.Int, this._getPostsBody.registerPostId)
                    .execute('GetPosts');

                return result as any as PostsQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetPosts;
