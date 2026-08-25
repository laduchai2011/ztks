import sql from 'mssql';
import { StatisticsField } from '@src/dataStruct/statistics';
import { CreateStatisticsBodyField } from '@src/dataStruct/statistics/body';

class MutateDB_CreateStatistics {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createStatisticsBody: CreateStatisticsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateStatisticsBody(createStatisticsBody: CreateStatisticsBodyField): void {
        this._createStatisticsBody = createStatisticsBody;
    }

    async run(): Promise<sql.IProcedureResult<StatisticsField> | undefined> {
        if (this._connectionPool !== undefined && this._createStatisticsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('sales', sql.Decimal(20, 2), this._createStatisticsBody.sales)
                    .input('zaloOaId', sql.Int, this._createStatisticsBody.zaloOaId)
                    .input('accountId', sql.Int, this._createStatisticsBody.accountId)
                    .input('ofDay', sql.DateTimeOffset, this._createStatisticsBody.ofDay)
                    .execute('CreateStatistics');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateStatistics;
