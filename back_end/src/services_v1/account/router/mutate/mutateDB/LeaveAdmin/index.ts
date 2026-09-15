import sql from 'mssql';
import { LeaveAdminBodyField } from '@src/dataStruct/account/body';

class MutateDB_LeaveAdmin {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _leaveAdminBody: LeaveAdminBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setLeaveAdminBody(leaveAdminBody: LeaveAdminBodyField): void {
        this._leaveAdminBody = leaveAdminBody;
    }

    async run(): Promise<sql.IProcedureResult<boolean> | undefined> {
        if (this._connectionPool !== undefined && this._leaveAdminBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._leaveAdminBody.accountId)
                    .execute('LeaveAdmin');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_LeaveAdmin;
