import sql from 'mssql';
import { BalanceFluctuationField } from '@src/dataStruct/wallet';
import { GetBalanceFluctuationsByDateBodyField } from '@src/dataStruct/wallet/body';

class QueryDB_GetBalanceFluctuationsByDate {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getBalanceFluctuationsByDateBody: GetBalanceFluctuationsByDateBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetBalanceFluctuationsByDateBody(getBalanceFluctuationsByDateBody: GetBalanceFluctuationsByDateBodyField): void {
        this._getBalanceFluctuationsByDateBody = getBalanceFluctuationsByDateBody;
    }

    async run(): Promise<sql.IProcedureResult<BalanceFluctuationField[]> | void> {
        if (this._connectionPool !== undefined && this._getBalanceFluctuationsByDateBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('walletId', sql.Int, this._getBalanceFluctuationsByDateBody.walletId)
                    .input('type', sql.VarChar(255), this._getBalanceFluctuationsByDateBody.type ?? null)
                    .input('fromDate', sql.DateTime2, new Date(this._getBalanceFluctuationsByDateBody.fromDate))
                    .input('toDate', sql.DateTime2, new Date(this._getBalanceFluctuationsByDateBody.toDate))
                    .execute('GetBalanceFluctuationsByDate');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetBalanceFluctuationsByDate;
