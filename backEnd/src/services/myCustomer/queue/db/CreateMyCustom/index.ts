import sql from 'mssql';
import { MutateDB } from '@src/services/myCustomer/interface';
import { MyCustomerField, CreateMyCustomerBodyField } from '@src/dataStruct/myCustomer';

class MutateDB_CreateMyCustom extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createMyCustomerBody: CreateMyCustomerBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateMyCustomerBody(createMyCustomBody: CreateMyCustomerBodyField): void {
        this._createMyCustomerBody = createMyCustomBody;
    }

    async run(): Promise<sql.IProcedureResult<MyCustomerField> | undefined> {
        if (this._connectionPool !== undefined && this._createMyCustomerBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('senderId', sql.NVarChar(255), this._createMyCustomerBody.senderId)
                    .input('accountId', sql.Int, this._createMyCustomerBody.accountId)
                    .execute('CreateMyCustomer');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateMyCustom;
