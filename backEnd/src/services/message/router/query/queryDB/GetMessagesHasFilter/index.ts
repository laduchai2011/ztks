import sql from 'mssql';
import { QueryDB } from '@src/services/message/interface';
import { MessageField, MessagesHasFilterBodyField } from '@src/dataStruct/message';

interface TotalCountField {
    totalCount: number;
}

type MessageQueryResult = {
    recordsets: [MessageField[], TotalCountField[]];
    recordset: MessageField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetMessagesHasFilter extends QueryDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _messagesHasFilterBody: MessagesHasFilterBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setMessagesHasFilterBody(messagesHasFilterBody: MessagesHasFilterBodyField): void {
        this._messagesHasFilterBody = messagesHasFilterBody;
    }

    async run(): Promise<MessageQueryResult | void> {
        if (this._connectionPool !== undefined && this._messagesHasFilterBody !== undefined) {
            try {
                const accountId = this._messagesHasFilterBody.accountId ? this._messagesHasFilterBody.accountId : null;

                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._messagesHasFilterBody.page)
                    .input('size', sql.Int, this._messagesHasFilterBody.size)
                    .input('receiveId', sql.NVarChar(255), this._messagesHasFilterBody.receiveId)
                    .input('sender', sql.NVarChar(255), this._messagesHasFilterBody.sender)
                    .input('messageStatus', sql.NVarChar(255), this._messagesHasFilterBody.messageStatus)
                    .input('accountId', sql.Int, accountId)
                    .execute('GetMessagesHasFilter');

                return result as any as MessageQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMessagesHasFilter;
