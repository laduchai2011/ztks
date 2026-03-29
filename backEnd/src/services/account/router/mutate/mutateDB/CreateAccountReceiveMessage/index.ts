import sql from 'mssql';
import { AccountReceiveMessageField } from '@src/dataStruct/account';
import { CreateAccountReceiveMessageBodyField } from '@src/dataStruct/account/body';

class MutateDB_CreateAccountReceiveMessage {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createAccountReceiveMessageBody: CreateAccountReceiveMessageBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateAccountReceiveMessageBody(createAccountReceiveMessageBody: CreateAccountReceiveMessageBodyField): void {
        this._createAccountReceiveMessageBody = createAccountReceiveMessageBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountReceiveMessageField> | undefined> {
        if (this._connectionPool !== undefined && this._createAccountReceiveMessageBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input(
                        'accountIdReceiveMessage',
                        sql.Int,
                        this._createAccountReceiveMessageBody.accountIdReceiveMessage ?? null
                    )
                    .input('zaloOaId', sql.Int, this._createAccountReceiveMessageBody.zaloOaId)
                    .input('accountId', sql.Int, this._createAccountReceiveMessageBody.accountId)
                    .execute('CreateAccountReceiveMessage');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateAccountReceiveMessage;
