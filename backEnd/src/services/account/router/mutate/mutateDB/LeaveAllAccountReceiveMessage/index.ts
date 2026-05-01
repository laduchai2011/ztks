import sql from 'mssql';
import { LeaveAllAccountReceiveMessageBodyField } from '@src/dataStruct/account/body';

class MutateDB_LeaveAllAccountReceiveMessage {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _leaveAllAccountReceiveMessageBody: LeaveAllAccountReceiveMessageBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setLeaveAllAccountReceiveMessageBody(
        leaveAllAccountReceiveMessageBody: LeaveAllAccountReceiveMessageBodyField
    ): void {
        this._leaveAllAccountReceiveMessageBody = leaveAllAccountReceiveMessageBody;
    }

    async run(): Promise<sql.IProcedureResult<boolean> | undefined> {
        if (this._connectionPool !== undefined && this._leaveAllAccountReceiveMessageBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._leaveAllAccountReceiveMessageBody.accountId)
                    .execute('LeaveAllAccountReceiveMessage');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_LeaveAllAccountReceiveMessage;
