import sql from 'mssql';
import { BankField } from '@src/dataStruct/bank';
import { GetBankWithIdBodyField } from '@src/dataStruct/bank/body';

class QueryDB_GetBankWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getBankWithIdBody: GetBankWithIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetBankWithIdBodyField(getBankWithIdBody: GetBankWithIdBodyField): void {
        this._getBankWithIdBody = getBankWithIdBody;
    }

    async run(): Promise<sql.IProcedureResult<BankField> | void> {
        if (this._connectionPool !== undefined && this._getBankWithIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._getBankWithIdBody.id)
                    .execute('GetBankWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetBankWithId;
