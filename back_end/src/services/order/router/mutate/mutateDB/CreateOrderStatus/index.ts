import sql from 'mssql';
import { OrderStatusField } from '@src/dataStruct/order';
import { CreateOrderStatusBodyField } from '@src/dataStruct/order/body';

class MutateDB_CreateOrderStatus {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createOrderStatusBody: CreateOrderStatusBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateOrderStatusBody(createOrderStatusBody: CreateOrderStatusBodyField): void {
        this._createOrderStatusBody = createOrderStatusBody;
    }

    async run(): Promise<sql.IProcedureResult<OrderStatusField> | undefined> {
        if (this._connectionPool !== undefined && this._createOrderStatusBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('type', sql.NVarChar(255), this._createOrderStatusBody.type)
                    .input('content', sql.NVarChar(255), this._createOrderStatusBody.content)
                    .input('orderId', sql.Int, this._createOrderStatusBody.orderId)
                    .input('accountId', sql.Int, this._createOrderStatusBody.accountId)
                    .execute('CreateOrderStatus');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateOrderStatus;
