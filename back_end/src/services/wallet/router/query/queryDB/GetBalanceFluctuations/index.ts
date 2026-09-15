import sql from 'mssql';
import { BalanceFluctuationField } from '@src/dataStruct/wallet';
import { GetBalanceFluctuationsBodyField } from '@src/dataStruct/wallet/body';

class QueryDB_GetBalanceFluctuations {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getBalanceFluctuationsBody: GetBalanceFluctuationsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetBalanceFluctuationsBody(getBalanceFluctuationsBody: GetBalanceFluctuationsBodyField): void {
        this._getBalanceFluctuationsBody = getBalanceFluctuationsBody;
    }

    async run(): Promise<sql.IProcedureResult<BalanceFluctuationField[]> | void> {
        if (this._connectionPool !== undefined && this._getBalanceFluctuationsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getBalanceFluctuationsBody.page)
                    .input('size', sql.Int, this._getBalanceFluctuationsBody.size)
                    .input('walletId', sql.Int, new Date(this._getBalanceFluctuationsBody.walletId))
                    .execute('GetBalanceFluctuations');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetBalanceFluctuations;
