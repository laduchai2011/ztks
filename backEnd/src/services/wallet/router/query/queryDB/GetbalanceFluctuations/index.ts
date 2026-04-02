import sql from 'mssql';
import { BalanceFluctuationField } from '@src/dataStruct/wallet';
import { GetbalanceFluctuationsBodyField } from '@src/dataStruct/wallet/body';

interface TotalCountField {
    totalCount: number;
}

type BalanceFluctuationQueryResult = {
    recordsets: [BalanceFluctuationField[], TotalCountField[]];
    recordset: BalanceFluctuationField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetbalanceFluctuations {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getbalanceFluctuationsBody: GetbalanceFluctuationsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetbalanceFluctuationsBody(getbalanceFluctuationsBody: GetbalanceFluctuationsBodyField): void {
        this._getbalanceFluctuationsBody = getbalanceFluctuationsBody;
    }

    async run(): Promise<BalanceFluctuationQueryResult | void> {
        if (this._connectionPool !== undefined && this._getbalanceFluctuationsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getbalanceFluctuationsBody.page)
                    .input('size', sql.Int, this._getbalanceFluctuationsBody.size)
                    .input('type', sql.VarChar(255), this._getbalanceFluctuationsBody.type ?? null)
                    .input('walletId', sql.Int, this._getbalanceFluctuationsBody.walletId)
                    .execute('GetbalanceFluctuations');

                return result as any as BalanceFluctuationQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetbalanceFluctuations;
