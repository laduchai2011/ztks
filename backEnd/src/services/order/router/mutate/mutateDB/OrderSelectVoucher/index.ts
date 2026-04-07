import sql from 'mssql';
import { OrderField } from '@src/dataStruct/order';
import { OrderSelectVoucherBodyField } from '@src/dataStruct/order/body';

class MutateDB_OrderSelectVoucher {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _orderSelectVoucherBody: OrderSelectVoucherBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setOrderSelectVoucherBody(orderSelectVoucherBody: OrderSelectVoucherBodyField): void {
        this._orderSelectVoucherBody = orderSelectVoucherBody;
    }

    async run(): Promise<sql.IProcedureResult<OrderField> | undefined> {
        if (this._connectionPool !== undefined && this._orderSelectVoucherBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._orderSelectVoucherBody.id)
                    .input('voucherId', sql.Int, this._orderSelectVoucherBody.voucherId)
                    .input('accountId', sql.Int, this._orderSelectVoucherBody.accountId)
                    .execute('OrderSelectVoucher');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_OrderSelectVoucher;
