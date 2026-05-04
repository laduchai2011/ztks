import sql from 'mssql';
import { ZaloOaTokenField } from '@src/dataStruct/zalo';
import { CreateZaloOaTokenBodyField } from '@src/dataStruct/zalo/body';

class MutateDB_CreateZaloOaToken {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createZaloOaTokenBody: CreateZaloOaTokenBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateZaloOaTokenBody(createZaloOaTokenBody: CreateZaloOaTokenBodyField): void {
        this._createZaloOaTokenBody = createZaloOaTokenBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloOaTokenField> | void> {
        if (this._connectionPool !== undefined && this._createZaloOaTokenBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('refreshToken', sql.NVarChar(sql.MAX), this._createZaloOaTokenBody.refreshToken)
                    .input('zaloOaId', sql.Int, this._createZaloOaTokenBody.zaloOaId)
                    .input('accountId', sql.Int, this._createZaloOaTokenBody.accountId)
                    .execute('CreateZaloOaToken');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateZaloOaToken;
