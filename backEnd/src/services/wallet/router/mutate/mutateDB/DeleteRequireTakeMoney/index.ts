import sql from 'mssql';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { DeleteRequireTakeMoneyBodyField } from '@src/dataStruct/wallet/body';

class MutateDB_DeleteRequireTakeMoney {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _deleteRequireTakeMoneyBody: DeleteRequireTakeMoneyBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setDeleteRequireTakeMoneyBody(deleteRequireTakeMoneyBody: DeleteRequireTakeMoneyBodyField): void {
        this._deleteRequireTakeMoneyBody = deleteRequireTakeMoneyBody;
    }

    async run(): Promise<sql.IProcedureResult<RequireTakeMoneyField> | undefined> {
        if (this._connectionPool !== undefined && this._deleteRequireTakeMoneyBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('requireTakeMoneyId', sql.Int, this._deleteRequireTakeMoneyBody.requireTakeMoneyId)
                    .input('accountId', sql.Int, this._deleteRequireTakeMoneyBody.accountId)
                    .execute('DeleteRequireTakeMoney');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_DeleteRequireTakeMoney;
