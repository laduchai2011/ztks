import sql from 'mssql';
import { StatisticsField } from '@src/dataStruct/statistics';
import { GetStatisticsBodyField } from '@src/dataStruct/statistics/body';

interface TotalCountField {
    totalCount: number;
}

type StatisticsQueryResult = {
    recordsets: [StatisticsField[], TotalCountField[]];
    recordset: StatisticsField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

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

    async run(): Promise<StatisticsQueryResult | void> {
        if (this._connectionPool !== undefined && this._getStatisticsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('fromDate', sql.DateTimeOffset(7), this._getStatisticsBody.fromDate)
                    .input('toDate', sql.DateTimeOffset(7), this._getStatisticsBody.toDate)
                    .input('zaloOaId', sql.Int, this._getStatisticsBody.zaloOaId)
                    .input('accountId', sql.Int, this._getStatisticsBody.accountId)
                    .execute('GetStatistics');

                return result as any as StatisticsQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetStatistics;
