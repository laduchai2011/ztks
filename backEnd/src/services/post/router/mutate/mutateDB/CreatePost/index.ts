import sql from 'mssql';
import { PostField } from '@src/dataStruct/post';
import { CreatePostBodyField } from '@src/dataStruct/post/body';

class MutateDB_CreatePost {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createPostBody: CreatePostBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreatePostBody(createPostBody: CreatePostBodyField): void {
        this._createPostBody = createPostBody;
    }

    async run(): Promise<sql.IProcedureResult<PostField> | undefined> {
        if (this._connectionPool !== undefined && this._createPostBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('index', sql.Int, this._createPostBody.index)
                    .input('name', sql.NVarChar(255), this._createPostBody.name)
                    .input('type', sql.VarChar(255), this._createPostBody.type)
                    .input('title', sql.NVarChar(255), this._createPostBody.title)
                    .input('describe', sql.NVarChar(sql.MAX), this._createPostBody.describe)
                    .input('images', sql.NVarChar(sql.MAX), this._createPostBody.images)
                    .input('isActive', sql.Bit, this._createPostBody.isActive)
                    .input('registerPostId', sql.Int, this._createPostBody.registerPostId)
                    .input('accountId', sql.Int, this._createPostBody.accountId)
                    .execute('CreatePost');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreatePost;
