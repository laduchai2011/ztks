import sql from 'mssql';
import { CheckInOutWithDateField } from '@src/dataStruct/checkInOut';
import { GetMyCheckInOutsBodyField } from '@src/dataStruct/checkInOut/body';

class QueryDB_GetMyCheckInOuts {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getMyCheckInOutsBody: GetMyCheckInOutsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetMyCheckInOutsBody(getMyCheckInOutsBody: GetMyCheckInOutsBodyField): void {
        this._getMyCheckInOutsBody = getMyCheckInOutsBody;
    }

    async run(): Promise<sql.IProcedureResult<CheckInOutWithDateField[]> | void> {
        if (this._connectionPool !== undefined && this._getMyCheckInOutsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('fromDate', sql.Date, new Date(this._getMyCheckInOutsBody.fromDate))
                    .input('toDate', sql.Date, new Date(this._getMyCheckInOutsBody.toDate))
                    .input('accountId', sql.Int, this._getMyCheckInOutsBody.accountId)
                    .execute('GetMyCheckInOuts');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMyCheckInOuts;
