import sql from 'mssql';
import { PostField } from '@src/dataStruct/post';
import { GetPostWithIdBodyField } from '@src/dataStruct/post/body';

class QueryDB_GetPostWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getPostWithIdBody: GetPostWithIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetPostWithIdBody(getPostWithIdBody: GetPostWithIdBodyField): void {
        this._getPostWithIdBody = getPostWithIdBody;
    }

    async run(): Promise<sql.IProcedureResult<PostField> | void> {
        if (this._connectionPool !== undefined && this._getPostWithIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._getPostWithIdBody.id)
                    .execute('GetPostWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetPostWithId;
