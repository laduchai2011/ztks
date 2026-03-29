import sql from 'mssql';
import { QueryDB } from '@src/services/myCustomer/interface';
import { MyCustomerField, MyCustomerBodyField } from '@src/dataStruct/myCustomer';

interface TotalCountField {
    totalCount: number;
}

type MyCustomQueryResult = {
    recordsets: [MyCustomerField[], TotalCountField[]];
    recordset: MyCustomerField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetMyCustoms extends QueryDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _myCustomerBody: MyCustomerBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setMyCustomerBody(myCustomerBody: MyCustomerBodyField): void {
        this._myCustomerBody = myCustomerBody;
    }

    async run(): Promise<MyCustomQueryResult | void> {
        if (this._connectionPool !== undefined && this._myCustomerBody !== undefined) {
            try {
                const accountId = this._myCustomerBody.accountId ? this._myCustomerBody.accountId : null;

                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._myCustomerBody.page)
                    .input('size', sql.Int, this._myCustomerBody.size)
                    .input('accountId', sql.Int, accountId)
                    .execute('GetMyCustomers');

                return result as unknown as MyCustomQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMyCustoms;
