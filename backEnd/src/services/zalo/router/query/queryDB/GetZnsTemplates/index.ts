import sql from 'mssql';
import { ZnsTemplateField } from '@src/dataStruct/zalo';
import { GetZnsTemplatesBodyField } from '@src/dataStruct/zalo/body';

interface TotalCountField {
    totalCount: number;
}

type ZnsTemplateQueryResult = {
    recordsets: [ZnsTemplateField[], TotalCountField[]];
    recordset: ZnsTemplateField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetZnsTemplates {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getZnsTemplatesBody: GetZnsTemplatesBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetZnsTemplatesBody(getZnsTemplatesBody: GetZnsTemplatesBodyField): void {
        this._getZnsTemplatesBody = getZnsTemplatesBody;
    }

    async run(): Promise<ZnsTemplateQueryResult | void> {
        if (this._connectionPool !== undefined && this._getZnsTemplatesBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getZnsTemplatesBody.page)
                    .input('size', sql.Int, this._getZnsTemplatesBody.size)
                    .input('offset', sql.Int, this._getZnsTemplatesBody.offset)
                    .input('zaloOaId', sql.Int, this._getZnsTemplatesBody.zaloOaId)
                    .input('accountId', sql.Int, this._getZnsTemplatesBody.accountId)
                    .execute('GetMyNotes');

                return result as unknown as ZnsTemplateQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetZnsTemplates;
