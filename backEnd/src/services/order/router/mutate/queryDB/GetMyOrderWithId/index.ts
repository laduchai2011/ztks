import sql from 'mssql';
import { OrderField } from '@src/dataStruct/order';
import { GetMyOrderWithIdBodyField } from '@src/dataStruct/order/body';

class QueryDB_GetMyOrderWithId {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getMyOrderWithIdBody: GetMyOrderWithIdBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetMyOrderWithIdBody(getMyOrderWithIdBody: GetMyOrderWithIdBodyField): void {
        this._getMyOrderWithIdBody = getMyOrderWithIdBody;
    }

    async run(): Promise<sql.IProcedureResult<OrderField> | void> {
        if (this._connectionPool !== undefined && this._getMyOrderWithIdBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._getMyOrderWithIdBody.id)
                    .input('accountId', sql.Int, this._getMyOrderWithIdBody.accountId)
                    .execute('GetMyOrderWithId');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMyOrderWithId;
