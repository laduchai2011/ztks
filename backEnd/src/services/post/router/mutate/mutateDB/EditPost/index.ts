import sql from 'mssql';
import { PostField } from '@src/dataStruct/post';
import { EditPostBodyField } from '@src/dataStruct/post/body';

class MutateDB_EditPost {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _editPostBody: EditPostBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setEditPostBody(editPostBody: EditPostBodyField): void {
        this._editPostBody = editPostBody;
    }

    async run(): Promise<sql.IProcedureResult<PostField> | undefined> {
        if (this._connectionPool !== undefined && this._editPostBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._editPostBody.id)
                    .input('index', sql.Int, this._editPostBody.index)
                    .input('name', sql.NVarChar(255), this._editPostBody.name)
                    .input('title', sql.NVarChar(255), this._editPostBody.title)
                    .input('describe', sql.NVarChar(sql.MAX), this._editPostBody.describe)
                    .input('images', sql.NVarChar(sql.MAX), this._editPostBody.images)
                    .input('isActive', sql.Bit, this._editPostBody.isActive)
                    .input('accountId', sql.Int, this._editPostBody.accountId)
                    .execute('EditPost');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_EditPost;
