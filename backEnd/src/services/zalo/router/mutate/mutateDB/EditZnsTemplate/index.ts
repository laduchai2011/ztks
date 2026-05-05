import sql from 'mssql';
import { ZnsTemplateField } from '@src/dataStruct/zalo';
import { EditZnsTemplateBodyField } from '@src/dataStruct/zalo/body';

class MutateDB_EditZnsTemplate {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _editZnsTemplateBody: EditZnsTemplateBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setEditZnsTemplateBody(editZnsTemplateBody: EditZnsTemplateBodyField): void {
        this._editZnsTemplateBody = editZnsTemplateBody;
    }

    async run(): Promise<sql.IProcedureResult<ZnsTemplateField> | void> {
        if (this._connectionPool !== undefined && this._editZnsTemplateBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._editZnsTemplateBody.id)
                    .input('temId', sql.NVarChar(255), this._editZnsTemplateBody.temId)
                    .input('images', sql.NVarChar(sql.MAX), this._editZnsTemplateBody.images)
                    .input('dataFields', sql.NVarChar(sql.MAX), this._editZnsTemplateBody.dataFields)
                    .input('zaloOaId', sql.Int, this._editZnsTemplateBody.zaloOaId)
                    .input('accountId', sql.Int, this._editZnsTemplateBody.accountId)
                    .execute('EditZnsTemplate');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_EditZnsTemplate;
