import sql from 'mssql';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { ChatSessionWithAccountIdBodyField } from '@src/dataStruct/chatSession/body';

interface TotalCountField {
    totalCount: number;
}

type ChatSessionQueryResult = {
    recordsets: [ChatSessionField[], TotalCountField[]];
    recordset: ChatSessionField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetChatSessionsWithAccountId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _chatSessionWithAccountIdBody: ChatSessionWithAccountIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setChatSessionWithAccountIdBody(chatSessionWithAccountIdBody: ChatSessionWithAccountIdBodyField): void {
        this._chatSessionWithAccountIdBody = chatSessionWithAccountIdBody;
    }

    async run(): Promise<ChatSessionQueryResult | void> {
        if (this._connectionPool !== undefined && this._chatSessionWithAccountIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._chatSessionWithAccountIdBody.page)
                    .input('size', sql.Int, this._chatSessionWithAccountIdBody.size)
                    .input('zaloOaId', sql.Int, this._chatSessionWithAccountIdBody.zaloOaId)
                    .input('accountId', sql.Int, this._chatSessionWithAccountIdBody.accountId)
                    .execute('GetChatSessionsWithAccountId');

                return result as any as ChatSessionQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetChatSessionsWithAccountId;
