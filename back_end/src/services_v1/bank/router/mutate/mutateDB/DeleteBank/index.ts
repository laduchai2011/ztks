import sql from 'mssql';
import { BankField } from '@src/dataStruct/bank';
import { DeleteBankBodyField } from '@src/dataStruct/bank/body';

class MutateDB_DeleteBank {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _deleteBankBody: DeleteBankBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setDeleteBankBody(deleteBankBody: DeleteBankBodyField): void {
        this._deleteBankBody = deleteBankBody;
    }

    async run(): Promise<sql.IProcedureResult<BankField> | undefined> {
        if (this._connectionPool !== undefined && this._deleteBankBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._deleteBankBody.id)
                    .input('accountId', sql.Int, this._deleteBankBody.accountId)
                    .execute('DeleteBank');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_DeleteBank;
