import sql from 'mssql';
import { BankField } from '@src/dataStruct/bank';
import { AddBankBodyField } from '@src/dataStruct/bank/body';

class MutateDB_AddBank {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _addBankBody: AddBankBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setAddBankBody(addBankBody: AddBankBodyField): void {
        this._addBankBody = addBankBody;
    }

    async run(): Promise<sql.IProcedureResult<BankField> | undefined> {
        if (this._connectionPool !== undefined && this._addBankBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('bankCode', sql.VarChar(255), this._addBankBody.bankCode)
                    .input('accountNumber', sql.VarChar(255), this._addBankBody.accountNumber)
                    .input('accountName', sql.VarChar(255), this._addBankBody.accountName)
                    .input('accountId', sql.Int, this._addBankBody.accountId)
                    .execute('AddBank');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_AddBank;
