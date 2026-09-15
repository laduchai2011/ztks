import sql from 'mssql';
import { OrderStatusField } from '@src/dataStruct/order';
import { GetAllOrderStatusBodyField } from '@src/dataStruct/order/body';

class QueryDB_GetAllOrderStatus {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getAllOrderStatusBody: GetAllOrderStatusBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetAllOrderStatusBody(getAllOrderStatusBody: GetAllOrderStatusBodyField): void {
        this._getAllOrderStatusBody = getAllOrderStatusBody;
    }

    async run(): Promise<sql.IProcedureResult<OrderStatusField[]> | void> {
        if (this._connectionPool !== undefined && this._getAllOrderStatusBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('orderId', sql.Int, this._getAllOrderStatusBody.orderId)
                    .execute('GetAllOrderStatus');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAllOrderStatus;
