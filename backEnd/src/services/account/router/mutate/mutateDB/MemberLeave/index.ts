import sql from 'mssql';
import { MemberLeaveBodyField } from '@src/dataStruct/account/body';

class MutateDB_MemberLeave {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _memberLeaveBody: MemberLeaveBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setMemberLeaveBody(memberLeaveBody: MemberLeaveBodyField): void {
        this._memberLeaveBody = memberLeaveBody;
    }

    async run(): Promise<sql.IProcedureResult<boolean> | undefined> {
        if (this._connectionPool !== undefined && this._memberLeaveBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._memberLeaveBody.accountId)
                    .execute('MemberLeave');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_MemberLeave;
