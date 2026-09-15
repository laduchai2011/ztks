import sql from 'mssql';
import { OrderField } from '@src/dataStruct/order';
import { OrdersFilterBodyField } from '@src/dataStruct/order/body';

interface TotalCountField {
    totalCount: number;
}

type OrdersQueryResult = {
    recordsets: [OrderField[], TotalCountField[]];
    recordset: OrderField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetOrders {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _ordersFilterBody: OrdersFilterBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setOrdersFilterBody(ordersFilterBody: OrdersFilterBodyField): void {
        this._ordersFilterBody = ordersFilterBody;
    }

    async run(): Promise<OrdersQueryResult | void> {
        if (this._connectionPool !== undefined && this._ordersFilterBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._ordersFilterBody.page)
                    .input('size', sql.Int, this._ordersFilterBody.size)
                    .input('uuid', sql.NVarChar(255), this._ordersFilterBody.uuid ?? null)
                    .input('moneyFrom', sql.Decimal(20, 2), this._ordersFilterBody.moneyFrom ?? null)
                    .input('moneyTo', sql.Decimal(20, 2), this._ordersFilterBody.moneyTo ?? null)
                    .input('isPay', sql.Bit, this._ordersFilterBody.isPay ?? null)
                    .input('phone', sql.NVarChar(255), this._ordersFilterBody.phone ?? null)
                    .input('isDelete', sql.Bit, this._ordersFilterBody.isDelete ?? null)
                    .input('chatRoomId', sql.Int, this._ordersFilterBody.chatRoomId)
                    .input('accountId', sql.Int, this._ordersFilterBody.accountId)
                    .execute('GetOrders');

                return result as unknown as OrdersQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetOrders;
