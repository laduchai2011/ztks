import sql from 'mssql';
import { StatisticsField } from '@src/dataStruct/statistics';
import { UpdateStatisticsBodyField } from '@src/dataStruct/statistics/body';

class MutateDB_UpdateStatistics {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateStatisticsBody: UpdateStatisticsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateStatisticsBody(updateStatisticsBody: UpdateStatisticsBodyField): void {
        this._updateStatisticsBody = updateStatisticsBody;
    }

    async run(): Promise<sql.IProcedureResult<StatisticsField> | undefined> {
        if (this._connectionPool !== undefined && this._updateStatisticsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('sales', sql.Decimal(20, 2), this._updateStatisticsBody.sales)
                    .input('zaloOaId', sql.Int, this._updateStatisticsBody.zaloOaId)
                    .input('accountId', sql.Int, this._updateStatisticsBody.accountId)
                    .input('ofDay', sql.DateTimeOffset(7), this._updateStatisticsBody.ofDay)
                    .execute('UpdateStatistics');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateStatistics;
