import sql from 'mssql';
import { ZaloOaTokenField } from '@src/dataStruct/zalo';
import { UpdateRefreshTokenOfZaloOaBodyField } from '@src/dataStruct/zalo/body';

class MutateDB_UpdateRefreshTokenOfZaloOa {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateRefreshTokenOfZaloOaBody: UpdateRefreshTokenOfZaloOaBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateRefreshTokenOfZaloOaBody(updateRefreshTokenOfZaloOaBody: UpdateRefreshTokenOfZaloOaBodyField): void {
        this._updateRefreshTokenOfZaloOaBody = updateRefreshTokenOfZaloOaBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloOaTokenField> | void> {
        if (this._connectionPool !== undefined && this._updateRefreshTokenOfZaloOaBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('refreshToken', sql.NVarChar(sql.MAX), this._updateRefreshTokenOfZaloOaBody.refreshToken)
                    .input('zaloOaId', sql.Int, this._updateRefreshTokenOfZaloOaBody.zaloOaId)
                    .execute('UpdateRefreshTokenOfZaloOa');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateRefreshTokenOfZaloOa;
