import sql from 'mssql';
import { OrderField } from '@src/dataStruct/order';
import { GetOrdersWithPhoneBodyField } from '@src/dataStruct/order/body';

interface TotalCountField {
    totalCount: number;
}

type OrdersQueryResult = {
    recordsets: [OrderField[], TotalCountField[]];
    recordset: OrderField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetOrdersWithPhone {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getOrdersWithPhoneBody: GetOrdersWithPhoneBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetOrdersWithPhoneBody(_getOrdersWithPhoneBody: GetOrdersWithPhoneBodyField): void {
        this._getOrdersWithPhoneBody = _getOrdersWithPhoneBody;
    }

    async run(): Promise<OrdersQueryResult | void> {
        if (this._connectionPool !== undefined && this._getOrdersWithPhoneBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getOrdersWithPhoneBody.page)
                    .input('size', sql.Int, this._getOrdersWithPhoneBody.size)
                    .input('phone', sql.NVarChar(255), this._getOrdersWithPhoneBody.phone)
                    .execute('GetOrdersWithPhone');

                return result as unknown as OrdersQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetOrdersWithPhone;
