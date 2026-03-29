import sql from 'mssql';
import { QueryDB } from '@src/services/myCustomer/interface';
import { MyCustomerField, AMyCustomerBodyField } from '@src/dataStruct/myCustomer';

class QueryDB_GetAMyCustomer extends QueryDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _aMyCustomerBody: AMyCustomerBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setAMyCustomerBody(aMyCustomerBody: AMyCustomerBodyField): void {
        this._aMyCustomerBody = aMyCustomerBody;
    }

    async run(): Promise<sql.IProcedureResult<MyCustomerField> | void> {
        if (this._connectionPool !== undefined && this._aMyCustomerBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('senderId', sql.NVarChar(255), this._aMyCustomerBody.senderId)
                    .execute('GetAMyCustomer');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAMyCustomer;
