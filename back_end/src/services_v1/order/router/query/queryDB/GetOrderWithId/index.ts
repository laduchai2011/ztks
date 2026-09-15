import sql from 'mssql';
import { OrderField } from '@src/dataStruct/order';
import { GetOrderWithIdBodyField } from '@src/dataStruct/order/body';

class QueryDB_GetOrderWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getOrderWithIdBody: GetOrderWithIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetOrderWithIdBody(getOrderWithIdBody: GetOrderWithIdBodyField): void {
        this._getOrderWithIdBody = getOrderWithIdBody;
    }

    async run(): Promise<sql.IProcedureResult<OrderField> | void> {
        if (this._connectionPool !== undefined && this._getOrderWithIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._getOrderWithIdBody.id)
                    .execute('GetOrderWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetOrderWithId;
