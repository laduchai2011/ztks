import sql from 'mssql';
import { RegisterPostField } from '@src/dataStruct/post';
import { DeleteRegisterPostBodyField } from '@src/dataStruct/post/body';

class MutateDB_DeleteRegisterPost {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _deleteRegisterPostBody: DeleteRegisterPostBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setDeleteRegisterPostBody(deleteRegisterPostBody: DeleteRegisterPostBodyField): void {
        this._deleteRegisterPostBody = deleteRegisterPostBody;
    }

    async run(): Promise<sql.IProcedureResult<RegisterPostField> | undefined> {
        if (this._connectionPool !== undefined && this._deleteRegisterPostBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()

                    .input('id', sql.Int, this._deleteRegisterPostBody.id)
                    .input('accountId', sql.Int, this._deleteRegisterPostBody.accountId)
                    .execute('DeleteRegisterPost');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_DeleteRegisterPost;
