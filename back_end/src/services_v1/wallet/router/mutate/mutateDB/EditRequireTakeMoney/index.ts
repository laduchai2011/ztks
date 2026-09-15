import sql from 'mssql';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { EditRequireTakeMoneyBodyField } from '@src/dataStruct/wallet/body';

class MutateDB_EditRequireTakeMoney {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _editRequireTakeMoneyBody: EditRequireTakeMoneyBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setEditRequireTakeMoneyBody(editRequireTakeMoneyBody: EditRequireTakeMoneyBodyField): void {
        this._editRequireTakeMoneyBody = editRequireTakeMoneyBody;
    }

    async run(): Promise<sql.IProcedureResult<RequireTakeMoneyField> | undefined> {
        if (this._connectionPool !== undefined && this._editRequireTakeMoneyBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('requireTakeMoneyId', sql.Int, this._editRequireTakeMoneyBody.requireTakeMoneyId)
                    .input('amount', sql.Decimal(20, 2), this._editRequireTakeMoneyBody.amount)
                    .input('bankId', sql.Int, this._editRequireTakeMoneyBody.bankId)
                    .input('walletId', sql.Int, this._editRequireTakeMoneyBody.walletId)
                    .input('accountId', sql.Int, this._editRequireTakeMoneyBody.accountId)
                    .execute('EditRequireTakeMoney');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_EditRequireTakeMoney;
