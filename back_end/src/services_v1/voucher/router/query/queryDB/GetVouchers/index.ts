import sql from 'mssql';
import { VoucherField } from '@src/dataStruct/voucher';
import { GetVouchersBodyField } from '@src/dataStruct/voucher/body';

interface TotalCountField {
    totalCount: number;
}

type VoucherQueryResult = {
    recordsets: [VoucherField[], TotalCountField[]];
    recordset: VoucherField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetVouchers {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getVouchersBody: GetVouchersBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetVouchersBody(getVouchersBody: GetVouchersBodyField): void {
        this._getVouchersBody = getVouchersBody;
    }

    async run(): Promise<VoucherQueryResult | void> {
        if (this._connectionPool !== undefined && this._getVouchersBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getVouchersBody.page)
                    .input('size', sql.Int, this._getVouchersBody.size)
                    .input('isUsed', sql.Bit, this._getVouchersBody.isUsed ?? null)
                    .input('phone', sql.NVarChar, this._getVouchersBody.phone)
                    .execute('GetVouchers');

                return result as any as VoucherQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetVouchers;
