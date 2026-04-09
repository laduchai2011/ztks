import sql from 'mssql';
import { VoucherField } from '@src/dataStruct/voucher';
import { CustomerUseVoucherBodyField } from '@src/dataStruct/voucher/body';

class MutateDB_CustomerUseVoucher {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _customerUseVoucherBody: CustomerUseVoucherBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCustomerUseVoucherBody(customerUseVoucherBody: CustomerUseVoucherBodyField): void {
        this._customerUseVoucherBody = customerUseVoucherBody;
    }

    async run(): Promise<sql.IProcedureResult<VoucherField> | undefined> {
        if (this._connectionPool !== undefined && this._customerUseVoucherBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('orderId', sql.Int, this._customerUseVoucherBody.orderId)
                    .input('voucherId', sql.Int, this._customerUseVoucherBody.voucherId)
                    .input('customerId', sql.Int, this._customerUseVoucherBody.customerId)
                    .execute('CustomerUseVoucher');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CustomerUseVoucher;
