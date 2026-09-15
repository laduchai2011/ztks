import sql from 'mssql';
import { QueryDB } from '@src/services/account/interface';
import { AccountInformationField } from '@src/dataStruct/account';

class QueryDB_GetAccountInformation extends QueryDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _accountId: number | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setAccountId(accountId: number): void {
        this._accountId = accountId;
    }

    async run(): Promise<sql.IProcedureResult<AccountInformationField> | void> {
        if (this._connectionPool !== undefined && this._accountId !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._accountId)
                    .execute('GetAccountInformation');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAccountInformation;
