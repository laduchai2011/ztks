import sql from 'mssql';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { CreateZaloOaBodyField } from '@src/dataStruct/zalo/body';

class MutateDB_CreateZaloOa {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createZaloOaBody: CreateZaloOaBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateZaloOaBody(createZaloOaBody: CreateZaloOaBodyField): void {
        this._createZaloOaBody = createZaloOaBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloOaField> | void> {
        if (this._connectionPool !== undefined && this._createZaloOaBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('label', sql.NVarChar(255), this._createZaloOaBody.label)
                    .input('oaId', sql.NVarChar(255), this._createZaloOaBody.oaId)
                    .input('oaName', sql.NVarChar(255), this._createZaloOaBody.oaName)
                    .input('oaSecret', sql.NVarChar(255), this._createZaloOaBody.oaSecret)
                    .input('zaloAppId', sql.Int, this._createZaloOaBody.zaloAppId)
                    .input('accountId', sql.Int, this._createZaloOaBody.accountId)
                    .execute('CreateZaloOa');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateZaloOa;
