import sql from 'mssql';
import { BalanceFluctuationField } from '@src/dataStruct/wallet';
import { GetBalanceFluctuationLatestDayBodyField } from '@src/dataStruct/wallet/body';

class QueryDB_GetBalanceFluctuationLatestDay {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getBalanceFluctuationLatestDayBody: GetBalanceFluctuationLatestDayBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetBalanceFluctuationLatestDay(
        getBalanceFluctuationLatestDayBody: GetBalanceFluctuationLatestDayBodyField
    ): void {
        this._getBalanceFluctuationLatestDayBody = getBalanceFluctuationLatestDayBody;
    }

    async run(): Promise<sql.IProcedureResult<BalanceFluctuationField[]> | void> {
        if (this._connectionPool !== undefined && this._getBalanceFluctuationLatestDayBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('walletId', sql.Int, this._getBalanceFluctuationLatestDayBody.walletId)
                    .input('type', sql.VarChar(255), this._getBalanceFluctuationLatestDayBody.type ?? null)
                    .execute('GetBalanceFluctuationLatestDay');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetBalanceFluctuationLatestDay;
