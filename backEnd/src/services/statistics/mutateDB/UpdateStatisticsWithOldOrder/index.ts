import sql from 'mssql';
import { StatisticsField } from '@src/dataStruct/statistics';
import { UpdateStatisticsWithOldOrderBodyField } from '@src/dataStruct/statistics/body';

class MutateDB_UpdateStatisticsWithOldOrder {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateStatisticsWithOldOrderBody: UpdateStatisticsWithOldOrderBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateStatisticsWithOldOrderBody(updateStatisticsWithOldOrderBody: UpdateStatisticsWithOldOrderBodyField): void {
        this._updateStatisticsWithOldOrderBody = updateStatisticsWithOldOrderBody;
    }

    async run(): Promise<sql.IProcedureResult<StatisticsField> | undefined> {
        if (this._connectionPool !== undefined && this._updateStatisticsWithOldOrderBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('sales', sql.Decimal(20, 2), this._updateStatisticsWithOldOrderBody.sales)
                    .input('zaloOaId', sql.Int, this._updateStatisticsWithOldOrderBody.zaloOaId)
                    .input('accountId', sql.Int, this._updateStatisticsWithOldOrderBody.accountId)
                    .input('ofDay', sql.DateTimeOffset(7), this._updateStatisticsWithOldOrderBody.ofDay)
                    .execute('UpdateStatisticsWithOldOrder');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateStatisticsWithOldOrder;
