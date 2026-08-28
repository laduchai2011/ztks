import sql from 'mssql';
import { StatisticsField } from '@src/dataStruct/statistics';
import { GetStatisticsBodyField } from '@src/dataStruct/statistics/body';

class QueryDB_GetStatistics {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getStatisticsBody: GetStatisticsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetStatisticsBody(getStatisticsBody: GetStatisticsBodyField): void {
        this._getStatisticsBody = getStatisticsBody;
    }

    async run(): Promise<sql.IProcedureResult<StatisticsField[]> | void> {
        if (this._connectionPool !== undefined && this._getStatisticsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('fromDate', sql.DateTimeOffset(7), new Date(this._getStatisticsBody.fromDate))
                    .input('toDate', sql.DateTimeOffset(7), new Date(this._getStatisticsBody.toDate))
                    .input('zaloOaId', sql.Int, this._getStatisticsBody.zaloOaId)
                    .input('accountId', sql.Int, this._getStatisticsBody.accountId)
                    .execute('GetStatistics');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetStatistics;
