import sql from 'mssql';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { EditZaloOaBodyField } from '@src/dataStruct/zalo/body';

class MutateDB_EditZaloOa {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _editZaloOaBody: EditZaloOaBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setEditZaloOaBody(editZaloOaBody: EditZaloOaBodyField): void {
        this._editZaloOaBody = editZaloOaBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloOaField> | void> {
        if (this._connectionPool !== undefined && this._editZaloOaBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._editZaloOaBody.id)
                    .input('label', sql.NVarChar(255), this._editZaloOaBody.label)
                    .input('oaId', sql.NVarChar(255), this._editZaloOaBody.oaId)
                    .input('oaName', sql.NVarChar(255), this._editZaloOaBody.oaName)
                    .input('oaSecret', sql.NVarChar(255), this._editZaloOaBody.oaSecret)
                    .input('zaloAppId', sql.Int, this._editZaloOaBody.zaloAppId)
                    .input('accountId', sql.Int, this._editZaloOaBody.accountId)
                    .execute('EditZaloOa');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_EditZaloOa;
