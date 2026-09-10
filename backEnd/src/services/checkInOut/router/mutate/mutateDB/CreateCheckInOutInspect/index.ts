import sql from 'mssql';
import { CheckInOutInspectField } from '@src/dataStruct/checkInOut';
import { CreateCheckInOutInspectBodyField } from '@src/dataStruct/checkInOut/body';

class MutateDB_CreateCheckInOutInspect {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createCheckInOutInspectBody: CreateCheckInOutInspectBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateCheckInOutInspectBody(createCheckInOutInspectBody: CreateCheckInOutInspectBodyField): void {
        this._createCheckInOutInspectBody = createCheckInOutInspectBody;
    }

    async run(): Promise<sql.IProcedureResult<CheckInOutInspectField> | undefined> {
        if (this._connectionPool !== undefined && this._createCheckInOutInspectBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('content', sql.NVarChar(255), this._createCheckInOutInspectBody.content)
                    .input('isPass', sql.Bit, this._createCheckInOutInspectBody.isPass)
                    .input('checkInOutId', sql.Int, this._createCheckInOutInspectBody.checkInOutId)
                    .input('accountId', sql.Int, this._createCheckInOutInspectBody.accountId)
                    .execute('CreateCheckInOutInspect');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateCheckInOutInspect;
