import sql from 'mssql';
import { RegisterPostField } from '@src/dataStruct/post';
import { GetRegisterPostWithIdBodyField } from '@src/dataStruct/post/body';

class QueryDB_GetRegisterPostWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getRegisterPostWithIdBody: GetRegisterPostWithIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetRegisterPostWithIdBody(getRegisterPostWithIdBody: GetRegisterPostWithIdBodyField): void {
        this._getRegisterPostWithIdBody = getRegisterPostWithIdBody;
    }

    async run(): Promise<sql.IProcedureResult<RegisterPostField> | void> {
        if (this._connectionPool !== undefined && this._getRegisterPostWithIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._getRegisterPostWithIdBody.id)
                    .execute('GetRegisterPostWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetRegisterPostWithId;
