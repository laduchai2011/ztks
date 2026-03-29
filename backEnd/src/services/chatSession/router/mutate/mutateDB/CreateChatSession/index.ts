import sql from 'mssql';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { ChatSessionBodyField } from '@src/dataStruct/chatSession/body';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { IsMyOaBodyField } from '@src/dataStruct/zalo/body';

class MutateDB_CreateChatSession {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _chatSessionBody: ChatSessionBodyField | undefined;
    private _isMyOaBody: IsMyOaBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setChatSessionBody(chatSessionBody: ChatSessionBodyField): void {
        this._chatSessionBody = chatSessionBody;
    }

    setIsMyOaBody(isMyOaBody: IsMyOaBodyField): void {
        this._isMyOaBody = isMyOaBody;
    }

    async isMyOa(): Promise<sql.IProcedureResult<ZaloOaField> | undefined> {
        if (this._connectionPool !== undefined && this._isMyOaBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._isMyOaBody.id)
                    .input('accountId', sql.Int, this._isMyOaBody.accountId)
                    .execute('IsMyOa');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }

    async run(): Promise<sql.IProcedureResult<ChatSessionField> | undefined> {
        if (this._connectionPool !== undefined && this._chatSessionBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('label', sql.NVarChar(255), this._chatSessionBody.label)
                    .input('code', sql.NVarChar(255), this._chatSessionBody.code)
                    .input('isReady', sql.Bit, this._chatSessionBody.isReady)
                    .input('selectedAccountId', sql.Int, this._chatSessionBody.selectedAccountId)
                    .input('zaloOaId', sql.Int, this._chatSessionBody.zaloOaId)
                    .input('accountId', sql.Int, this._chatSessionBody.accountId)
                    .execute('CreateChatSession');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateChatSession;
