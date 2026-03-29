import sql from 'mssql';
import { AccountField } from '@src/dataStruct/account';
import { CreateReplyAccountBodyField } from '@src/dataStruct/account/body';

class MutateDB_CreateReplyAccount {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createReplyAccountBody: CreateReplyAccountBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateReplyAccountBody(createReplyAccountBody: CreateReplyAccountBodyField): void {
        this._createReplyAccountBody = createReplyAccountBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountField> | undefined> {
        if (this._connectionPool !== undefined && this._createReplyAccountBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('authorizedAccountId', sql.Int, this._createReplyAccountBody.authorizedAccountId)
                    .input('chatRoomId', sql.Int, this._createReplyAccountBody.chatRoomId)
                    .input('accountId', sql.Int, this._createReplyAccountBody.accountId)
                    .execute('CreateReplyAccount');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateReplyAccount;
