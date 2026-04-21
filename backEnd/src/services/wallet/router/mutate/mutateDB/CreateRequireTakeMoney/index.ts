import sql from 'mssql';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { CreateRequireTakeMoneyBodyField } from '@src/dataStruct/wallet/body';

class MutateDB_CreateRequireTakeMoney {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createRequireTakeMoneyBody: CreateRequireTakeMoneyBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateRequireTakeMoneyBody(createRequireTakeMoneyBody: CreateRequireTakeMoneyBodyField): void {
        this._createRequireTakeMoneyBody = createRequireTakeMoneyBody;
    }

    async run(): Promise<sql.IProcedureResult<RequireTakeMoneyField> | undefined> {
        if (this._connectionPool !== undefined && this._createRequireTakeMoneyBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('amount', sql.Decimal(20, 2), this._createRequireTakeMoneyBody.amount)
                    .input('bankId', sql.Int, this._createRequireTakeMoneyBody.bankId)
                    .input('walletId', sql.Int, this._createRequireTakeMoneyBody.walletId)
                    .input('accountId', sql.Int, this._createRequireTakeMoneyBody.accountId)
                    .execute('CreateRequireTakeMoney');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateRequireTakeMoney;
