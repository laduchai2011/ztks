import sql from 'mssql';
import { VoucherField } from '@src/dataStruct/voucher';
import { GetVoucherWithOrderIdBodyField } from '@src/dataStruct/voucher/body';

class QueryDB_GetVoucherWithOrderId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getVoucherWithOrderIdBody: GetVoucherWithOrderIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetVoucherWithOrderIdBody(getVoucherWithOrderIdBody: GetVoucherWithOrderIdBodyField): void {
        this._getVoucherWithOrderIdBody = getVoucherWithOrderIdBody;
    }

    async run(): Promise<sql.IProcedureResult<VoucherField> | void> {
        if (this._connectionPool !== undefined && this._getVoucherWithOrderIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('orderId', sql.Int, this._getVoucherWithOrderIdBody.orderId)
                    .execute('GetVoucherWithOrderId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetVoucherWithOrderId;
