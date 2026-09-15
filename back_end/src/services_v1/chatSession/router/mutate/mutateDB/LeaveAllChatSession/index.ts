import sql from 'mssql';
import { LeaveAllChatSessionBodyField } from '@src/dataStruct/chatSession/body';

class MutateDB_LeaveAllChatSession {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _leaveAllChatSessionBody: LeaveAllChatSessionBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setLeaveAllChatSessionBody(leaveAllChatSessionBody: LeaveAllChatSessionBodyField): void {
        this._leaveAllChatSessionBody = leaveAllChatSessionBody;
    }

    async run(): Promise<sql.IProcedureResult<boolean> | undefined> {
        if (this._connectionPool !== undefined && this._leaveAllChatSessionBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._leaveAllChatSessionBody.accountId)
                    .execute('LeaveAllChatSession');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_LeaveAllChatSession;
