import sql from 'mssql';
import { StatisticsField } from '@src/dataStruct/statistics';
import { GetStatisticsOfDayBodyField } from '@src/dataStruct/statistics/body';

class QueryDB_GetStatisticsOfDay {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getStatisticsOfDayBody: GetStatisticsOfDayBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetStatisticsOfDayBody(getStatisticsOfDayBody: GetStatisticsOfDayBodyField): void {
        this._getStatisticsOfDayBody = getStatisticsOfDayBody;
    }

    async run(): Promise<sql.IProcedureResult<StatisticsField> | undefined> {
        if (this._connectionPool !== undefined && this._getStatisticsOfDayBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('ofDay', sql.DateTimeOffset(7), this._getStatisticsOfDayBody.ofDay)
                    .input('zaloOaId', sql.Int, this._getStatisticsOfDayBody.zaloOaId)
                    .input('accountId', sql.Int, this._getStatisticsOfDayBody.accountId)
                    .execute('GetStatisticsOfDay');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetStatisticsOfDay;
