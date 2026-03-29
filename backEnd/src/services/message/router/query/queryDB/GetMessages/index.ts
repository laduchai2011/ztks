import sql from 'mssql';
import { QueryDB } from '@src/services/message/interface';
import { MessageField, MessageBodyField } from '@src/dataStruct/message';

interface TotalCountField {
    totalCount: number;
}

type MessageQueryResult = {
    recordsets: [MessageField[], TotalCountField[]];
    recordset: MessageField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetMessages extends QueryDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _messageBody: MessageBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setMessageBody(messageBody: MessageBodyField): void {
        this._messageBody = messageBody;
    }

    async run(): Promise<MessageQueryResult | void> {
        if (this._connectionPool !== undefined && this._messageBody !== undefined) {
            try {
                const accountId = this._messageBody.accountId ? this._messageBody.accountId : null;

                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._messageBody.page)
                    .input('size', sql.Int, this._messageBody.size)
                    .input('receiveId', sql.NVarChar(255), this._messageBody.receiveId)
                    .input('accountId', sql.Int, accountId)
                    .execute('GetMessages');

                return result as any as MessageQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMessages;
