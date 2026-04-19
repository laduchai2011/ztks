import sql from 'mssql';
import { BankField } from '@src/dataStruct/bank';
import { GetAllBanksBodyField } from '@src/dataStruct/bank/body';

class QueryDB_GetAllBanks {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getAllBanksBody: GetAllBanksBodyField | undefined;

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetAllBanksBody(_getAllBanksBody: GetAllBanksBodyField): void {
        this._getAllBanksBody = _getAllBanksBody;
    }

    async run(): Promise<sql.IProcedureResult<BankField[]> | void> {
        if (this._connectionPool !== undefined && this._getAllBanksBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._getAllBanksBody.accountId)
                    .execute('GetAllBanks');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAllBanks;
