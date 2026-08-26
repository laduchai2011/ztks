import sql from 'mssql';
import { StatisticsField } from '@src/dataStruct/statistics';
import { UpdateStatisticsWithNewOrderBodyField } from '@src/dataStruct/statistics/body';

class MutateDB_UpdateStatisticsWithNewOrder {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateStatisticsWithNewOrderBody: UpdateStatisticsWithNewOrderBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateStatisticsWithNewOrderBody(updateStatisticsWithNewOrderBody: UpdateStatisticsWithNewOrderBodyField): void {
        this._updateStatisticsWithNewOrderBody = updateStatisticsWithNewOrderBody;
    }

    async run(): Promise<sql.IProcedureResult<StatisticsField> | undefined> {
        if (this._connectionPool !== undefined && this._updateStatisticsWithNewOrderBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('sales', sql.Decimal(20, 2), this._updateStatisticsWithNewOrderBody.sales)
                    .input('zaloOaId', sql.Int, this._updateStatisticsWithNewOrderBody.zaloOaId)
                    .input('accountId', sql.Int, this._updateStatisticsWithNewOrderBody.accountId)
                    .input('ofDay', sql.DateTimeOffset(7), this._updateStatisticsWithNewOrderBody.ofDay)
                    .execute('UpdateStatisticsWithNewOrder');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateStatisticsWithNewOrder;
