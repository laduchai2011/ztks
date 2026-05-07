import sql from 'mssql';
import { ZnsMessageField } from '@src/dataStruct/zalo';
import { CreateZnsMessageBodyField } from '@src/dataStruct/zalo/body';

class MutateDB_CreateZnsMessage {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createZnsMessageBody: CreateZnsMessageBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateZnsMessageBody(createZnsMessageBody: CreateZnsMessageBodyField): void {
        this._createZnsMessageBody = createZnsMessageBody;
    }

    async run(): Promise<sql.IProcedureResult<ZnsMessageField> | void> {
        if (this._connectionPool !== undefined && this._createZnsMessageBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('type', sql.NVarChar(255), this._createZnsMessageBody.type)
                    .input('data', sql.NVarChar(255), this._createZnsMessageBody.data)
                    .input('znsTemplateId', sql.Int, this._createZnsMessageBody.znsTemplateId)
                    .input('accountId', sql.Int, this._createZnsMessageBody.accountId)
                    .execute('CreateZnsMessage');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateZnsMessage;
