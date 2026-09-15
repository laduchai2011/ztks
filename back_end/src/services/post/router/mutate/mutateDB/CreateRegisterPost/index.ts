import sql from 'mssql';
import { RegisterPostField } from '@src/dataStruct/post';
import { CreateRegisterPostBodyField } from '@src/dataStruct/post/body';

class MutateDB_CreateRegisterPost {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createRegisterPostBody: CreateRegisterPostBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateRegisterPostBody(createRegisterPostBody: CreateRegisterPostBodyField): void {
        this._createRegisterPostBody = createRegisterPostBody;
    }

    async run(): Promise<sql.IProcedureResult<RegisterPostField> | undefined> {
        if (this._connectionPool !== undefined && this._createRegisterPostBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()

                    .input('name', sql.NVarChar(255), this._createRegisterPostBody.name)
                    .input('type', sql.VarChar(255), this._createRegisterPostBody.type)
                    .input('zaloOaId', sql.Int, this._createRegisterPostBody.zaloOaId)
                    .input('accountId', sql.Int, this._createRegisterPostBody.accountId)
                    .execute('CreateRegisterPost');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateRegisterPost;
