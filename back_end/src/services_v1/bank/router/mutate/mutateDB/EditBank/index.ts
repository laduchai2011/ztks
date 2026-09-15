import sql from 'mssql';
import { BankField } from '@src/dataStruct/bank';
import { EditBankBodyField } from '@src/dataStruct/bank/body';

class MutateDB_EditBank {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _editBankBody: EditBankBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setEditBankBody(editBankBody: EditBankBodyField): void {
        this._editBankBody = editBankBody;
    }

    async run(): Promise<sql.IProcedureResult<BankField> | undefined> {
        if (this._connectionPool !== undefined && this._editBankBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._editBankBody.id)
                    .input('bankCode', sql.VarChar(255), this._editBankBody.bankCode)
                    .input('accountNumber', sql.VarChar(255), this._editBankBody.accountNumber)
                    .input('accountName', sql.VarChar(255), this._editBankBody.accountName)
                    .input('accountId', sql.Int, this._editBankBody.accountId)
                    .execute('EditBank');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_EditBank;
