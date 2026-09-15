import sql from 'mssql';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { ZaloOaListWith2FkBodyField } from '@src/dataStruct/zalo/body';

interface TotalCountField {
    totalCount: number;
}

type ZaloOaQueryResult = {
    recordsets: [ZaloOaField[], TotalCountField[]];
    recordset: ZaloOaField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetZaloOaListWith2Fk {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _zaloOaListWith2FkBody: ZaloOaListWith2FkBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setZaloOaListWith2FkBody(zaloOaListWith2FkBody: ZaloOaListWith2FkBodyField): void {
        this._zaloOaListWith2FkBody = zaloOaListWith2FkBody;
    }

    async run(): Promise<ZaloOaQueryResult | void> {
        if (this._connectionPool !== undefined && this._zaloOaListWith2FkBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._zaloOaListWith2FkBody.page)
                    .input('size', sql.Int, this._zaloOaListWith2FkBody.size)
                    .input('zaloAppId', sql.Int, this._zaloOaListWith2FkBody.zaloAppId)
                    .input('accountId', sql.Int, this._zaloOaListWith2FkBody.accountId)
                    .execute('GetZaloOaListWith2Fk');

                return result as any as ZaloOaQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetZaloOaListWith2Fk;
