import sql from 'mssql';
import { MutateDB } from '@src/services/myCustomer/interface';
import { DelIsNewMessageBodyField } from '@src/dataStruct/myCustomer';

class MutateDB_DelIsNewMessage extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _delIsNewMessageBody: DelIsNewMessageBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setDelIsNewMessageBody(delIsNewMessageBody: DelIsNewMessageBodyField): void {
        this._delIsNewMessageBody = delIsNewMessageBody;
    }

    async run(): Promise<sql.IProcedureResult<any> | undefined> {
        if (this._connectionPool !== undefined && this._delIsNewMessageBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._delIsNewMessageBody.id)
                    .execute('DeleteIsNewMessage');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_DelIsNewMessage;
