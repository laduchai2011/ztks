import sql from 'mssql';
import { VoucherField } from '@src/dataStruct/voucher';
import { CreateVoucherBodyField } from '@src/dataStruct/voucher/body';

class MutateDB_CreateVoucher {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createVoucherBody: CreateVoucherBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateVoucherBody(createVoucherBody: CreateVoucherBodyField): void {
        this._createVoucherBody = createVoucherBody;
    }

    async run(): Promise<sql.IProcedureResult<VoucherField> | undefined> {
        if (this._connectionPool !== undefined && this._createVoucherBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('dayAmount', sql.Int, this._createVoucherBody.dayAmount)
                    .input('money', sql.Decimal(20, 2), this._createVoucherBody.money)
                    .input('phone', sql.NVarChar(255), this._createVoucherBody.phone)
                    .input('memberZtksId', sql.Int, this._createVoucherBody.memberZtksId)
                    .execute('CreateVoucher');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateVoucher;
