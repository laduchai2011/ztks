import sql from 'mssql';
import { RegisterPostField } from '@src/dataStruct/post';
import { EditRegisterPostBodyField } from '@src/dataStruct/post/body';

class MutateDB_EditRegisterPost {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _editRegisterPostBody: EditRegisterPostBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setEditRegisterPostBody(editRegisterPostBody: EditRegisterPostBodyField): void {
        this._editRegisterPostBody = editRegisterPostBody;
    }

    async run(): Promise<sql.IProcedureResult<RegisterPostField> | undefined> {
        if (this._connectionPool !== undefined && this._editRegisterPostBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()

                    .input('id', sql.Int, this._editRegisterPostBody.id)
                    .input('name', sql.NVarChar(255), this._editRegisterPostBody.name)
                    .input('zaloOaId', sql.Int, this._editRegisterPostBody.zaloOaId)
                    .input('accountId', sql.Int, this._editRegisterPostBody.accountId)
                    .execute('EditRegisterPost');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_EditRegisterPost;
