import sql from 'mssql';
import { OrderField } from '@src/dataStruct/order';
import { CreateOrderBodyField } from '@src/dataStruct/order/body';

class MutateDB_CreateOrder {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createOrderBody: CreateOrderBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateOrderBody(createOrderBody: CreateOrderBodyField): void {
        this._createOrderBody = createOrderBody;
    }

    async run(): Promise<sql.IProcedureResult<OrderField> | undefined> {
        if (this._connectionPool !== undefined && this._createOrderBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('uuid', sql.NVarChar(255), this._createOrderBody.uuid)
                    .input('label', sql.NVarChar(255), this._createOrderBody.label)
                    .input('content', sql.NVarChar(sql.MAX), this._createOrderBody.content)
                    .input('money', sql.Decimal(20, 2), this._createOrderBody.money)
                    .input('phone', sql.NVarChar(255), this._createOrderBody.phone)
                    .input('chatRoomId', sql.Int, this._createOrderBody.chatRoomId)
                    .input('zaloOaId', sql.Int, this._createOrderBody.zaloOaId)
                    .input('accountId', sql.Int, this._createOrderBody.accountId)
                    .execute('CreateOrder');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateOrder;
