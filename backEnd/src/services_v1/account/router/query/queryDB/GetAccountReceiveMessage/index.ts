import sql from 'mssql';
import { AccountReceiveMessageField } from '@src/dataStruct/account';
import { GetAccountReceiveMessageBodyField } from '@src/dataStruct/account/body';

class QueryDB_GetAccountReceiveMessage {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getAccountReceiveMessageBody: GetAccountReceiveMessageBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetAccountReceiveMessageBody(getAccountReceiveMessageBody: GetAccountReceiveMessageBodyField): void {
        this._getAccountReceiveMessageBody = getAccountReceiveMessageBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountReceiveMessageField> | void> {
        if (this._connectionPool !== undefined && this._getAccountReceiveMessageBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('zaloOaId', sql.Int, this._getAccountReceiveMessageBody.zaloOaId)
                    .input('accountId', sql.Int, this._getAccountReceiveMessageBody.accountId)
                    .execute('GetAccountReceiveMessage');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAccountReceiveMessage;
