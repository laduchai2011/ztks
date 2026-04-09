import sql from 'mssql';
import { CustomerField } from '@src/dataStruct/customer';

class QueryDB_CustomerGetMe {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _customerId: number | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCustomerId(customerId: number): void {
        this._customerId = customerId;
    }

    async run(): Promise<sql.IProcedureResult<CustomerField> | void> {
        if (this._connectionPool !== undefined && this._customerId !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._customerId)
                    .execute('CustomerGetMe');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_CustomerGetMe;
