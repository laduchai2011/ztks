import sql from 'mssql';
import { CheckInOutField } from '@src/dataStruct/checkInOut';
import { GetCheckInOutsWithDateBodyField } from '@src/dataStruct/checkInOut/body';

class QueryDB_GetCheckInOutsWithDate {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getCheckInOutsWithDateBody: GetCheckInOutsWithDateBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetCheckInOutsWithDateBody(getCheckInOutsWithDateBody: GetCheckInOutsWithDateBodyField): void {
        this._getCheckInOutsWithDateBody = getCheckInOutsWithDateBody;
    }

    async run(): Promise<sql.IProcedureResult<CheckInOutField[]> | void> {
        if (this._connectionPool !== undefined && this._getCheckInOutsWithDateBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('type', sql.NVarChar(255), this._getCheckInOutsWithDateBody.type)
                    .input('date', sql.Date, new Date(this._getCheckInOutsWithDateBody.date))
                    .input('accountId', sql.Int, this._getCheckInOutsWithDateBody.accountId)
                    .execute('GetCheckInOutsWithDate');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetCheckInOutsWithDate;
