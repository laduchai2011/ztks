import sql from 'mssql';
import { ZnsMessageField } from '@src/dataStruct/zalo';
import { GetZnsMessagesBodyField } from '@src/dataStruct/zalo/body';

interface TotalCountField {
    totalCount: number;
}

type ZnsMessageQueryResult = {
    recordsets: [ZnsMessageField[], TotalCountField[]];
    recordset: ZnsMessageField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetZnsMessages {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getZnsMessagesBody: GetZnsMessagesBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetZnsMessagesBody(getZnsMessagesBody: GetZnsMessagesBodyField): void {
        this._getZnsMessagesBody = getZnsMessagesBody;
    }

    async run(): Promise<ZnsMessageQueryResult | void> {
        if (this._connectionPool !== undefined && this._getZnsMessagesBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getZnsMessagesBody.page)
                    .input('size', sql.Int, this._getZnsMessagesBody.size)
                    .input('znsTemplateId', sql.Int, this._getZnsMessagesBody.znsTemplateId)
                    .input('accountId', sql.Int, this._getZnsMessagesBody.accountId)
                    .execute('GetZnsMessages');

                return result as unknown as ZnsMessageQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetZnsMessages;
