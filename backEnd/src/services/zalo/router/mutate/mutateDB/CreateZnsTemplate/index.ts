import sql from 'mssql';
import { ZnsTemplateField } from '@src/dataStruct/zalo';
import { CreateZnsTemplateBodyField } from '@src/dataStruct/zalo/body';

class MutateDB_CreateZnsTemplate {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createZnsTemplateBody: CreateZnsTemplateBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateZnsTemplateBody(createZnsTemplateBody: CreateZnsTemplateBodyField): void {
        this._createZnsTemplateBody = createZnsTemplateBody;
    }

    async run(): Promise<sql.IProcedureResult<ZnsTemplateField> | void> {
        if (this._connectionPool !== undefined && this._createZnsTemplateBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('temId', sql.NVarChar(255), this._createZnsTemplateBody.temId)
                    .input('images', sql.NVarChar(sql.MAX), this._createZnsTemplateBody.images)
                    .input('dataFields', sql.NVarChar(sql.MAX), this._createZnsTemplateBody.dataFields)
                    .input('zaloOaId', sql.Int, this._createZnsTemplateBody.zaloOaId)
                    .input('accountId', sql.Int, this._createZnsTemplateBody.accountId)
                    .execute('CreateZnsTemplate');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateZnsTemplate;
