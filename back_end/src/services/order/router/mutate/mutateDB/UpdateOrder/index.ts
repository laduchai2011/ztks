import sql from 'mssql';
import { OrderField } from '@src/dataStruct/order';
import { UpdateOrderBodyField } from '@src/dataStruct/order/body';

class MutateDB_UpdateOrder {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateOrderBody: UpdateOrderBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateOrderBody(updateOrderBody: UpdateOrderBodyField): void {
        this._updateOrderBody = updateOrderBody;
    }

    async run(): Promise<sql.IProcedureResult<OrderField> | undefined> {
        if (this._connectionPool !== undefined && this._updateOrderBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._updateOrderBody.id)
                    .input('label', sql.NVarChar(255), this._updateOrderBody.label)
                    .input('content', sql.NVarChar(sql.MAX), this._updateOrderBody.content)
                    .input('money', sql.Decimal(20, 2), this._updateOrderBody.money)
                    .input('phone', sql.NVarChar(255), this._updateOrderBody.phone)
                    .input('accountId', sql.Int, this._updateOrderBody.accountId)
                    .execute('UpdateOrder');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateOrder;
