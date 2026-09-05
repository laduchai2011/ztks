import sql from 'mssql';
import { CheckInOutField } from '@src/dataStruct/checkInOut';
import { CreateCheckInOutBodyField } from '@src/dataStruct/checkInOut/body';

class MutateDB_CreateCheckInOut {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createCheckInOutBody: CreateCheckInOutBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateCheckInOutBody(createCheckInOutBody: CreateCheckInOutBodyField): void {
        this._createCheckInOutBody = createCheckInOutBody;
    }

    async run(): Promise<sql.IProcedureResult<CheckInOutField> | undefined> {
        if (this._connectionPool !== undefined && this._createCheckInOutBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('type', sql.NVarChar(255), this._createCheckInOutBody.type)
                    .input('note', sql.NVarChar(255), this._createCheckInOutBody.note)
                    .input('image', sql.NVarChar(255), this._createCheckInOutBody.image ?? null)
                    .input('video', sql.NVarChar(255), this._createCheckInOutBody.video ?? null)
                    .input('accountId', sql.Int, this._createCheckInOutBody.accountId)
                    .execute('CreateCheckInOut');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateCheckInOut;
