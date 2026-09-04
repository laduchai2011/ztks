import sql from 'mssql';
import { StatisticsOaField } from '@src/dataStruct/statistics';
import { GetStatisticsOaBodyField } from '@src/dataStruct/statistics/body';

class QueryDB_GetStatisticsOa {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getStatisticsOaBody: GetStatisticsOaBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetStatisticsOaBody(getStatisticsOaBody: GetStatisticsOaBodyField): void {
        this._getStatisticsOaBody = getStatisticsOaBody;
    }

    async run(): Promise<sql.IProcedureResult<StatisticsOaField[]> | undefined> {
        if (this._connectionPool !== undefined && this._getStatisticsOaBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('fromDate', sql.Date, new Date(this._getStatisticsOaBody.fromDate))
                    .input('toDate', sql.Date, new Date(this._getStatisticsOaBody.toDate))
                    .input('zaloOaId', sql.Int, this._getStatisticsOaBody.zaloOaId)
                    .execute('GetStatisticsOa');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetStatisticsOa;
