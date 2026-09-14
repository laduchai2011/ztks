import sql from 'mssql';
import { AccountReceiveMessageField } from '@src/dataStruct/account';
import { UpdateAccountReceiveMessageBodyField } from '@src/dataStruct/account/body';

class MutateDB_UpdateAccountReceiveMessage {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateAccountReceiveMessageBody: UpdateAccountReceiveMessageBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateAccountReceiveMessageBody(updateAccountReceiveMessageBody: UpdateAccountReceiveMessageBodyField): void {
        this._updateAccountReceiveMessageBody = updateAccountReceiveMessageBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountReceiveMessageField> | undefined> {
        if (this._connectionPool !== undefined && this._updateAccountReceiveMessageBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input(
                        'accountIdReceiveMessage',
                        sql.Int,
                        this._updateAccountReceiveMessageBody.accountIdReceiveMessage ?? null
                    )
                    .input('zaloOaId', sql.Int, this._updateAccountReceiveMessageBody.zaloOaId)
                    .input('accountId', sql.Int, this._updateAccountReceiveMessageBody.accountId)
                    .execute('UpdateAccountReceiveMessage');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateAccountReceiveMessage;
