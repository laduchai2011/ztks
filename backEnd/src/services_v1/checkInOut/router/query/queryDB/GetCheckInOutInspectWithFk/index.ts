import sql from 'mssql';
import { CheckInOutInspectField } from '@src/dataStruct/checkInOut';
import { GetCheckInOutInspectWithFkBodyField } from '@src/dataStruct/checkInOut/body';

class QueryDB_GetCheckInOutInspectWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getCheckInOutInspectWithFkBody: GetCheckInOutInspectWithFkBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetCheckInOutInspectWithFkBody(getCheckInOutInspectWithFkBody: GetCheckInOutInspectWithFkBodyField): void {
        this._getCheckInOutInspectWithFkBody = getCheckInOutInspectWithFkBody;
    }

    async run(): Promise<sql.IProcedureResult<CheckInOutInspectField> | void> {
        if (this._connectionPool !== undefined && this._getCheckInOutInspectWithFkBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('checkInOutId', sql.Int, this._getCheckInOutInspectWithFkBody.checkInOutId)
                    .execute('GetCheckInOutInspectWithFk');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetCheckInOutInspectWithId;
