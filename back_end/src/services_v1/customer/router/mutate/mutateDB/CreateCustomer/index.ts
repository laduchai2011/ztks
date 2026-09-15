import sql from 'mssql';
import { CreateCustomerBodyField } from '@src/dataStruct/customer/body';
import { CustomerField } from '@src/dataStruct/customer';

class MutateDB_CreateCustomer {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createCustomerBody: CreateCustomerBodyField | undefined;

    constructor() {}

    set_connection_pool = (connectionPool: sql.ConnectionPool): void => {
        this._connectionPool = connectionPool;
    };

    setCreateCustomerBody = (createCustomerBody: CreateCustomerBodyField) => {
        this._createCustomerBody = createCustomerBody;
    };

    isCheckPhone = async (phone: string): Promise<boolean> => {
        if (this._connectionPool !== undefined) {
            return await isCheckPhone(this._connectionPool, phone);
        }
        return false;
    };

    async run(): Promise<sql.IResult<CustomerField> | void> {
        if (this._connectionPool !== undefined && this._createCustomerBody !== undefined) {
            try {
                const result = CreateToDB(this._connectionPool, this._createCustomerBody);
                return result;
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error('MutateDB_CreateCustomer: error method run()');
        }
    }
}

async function isCheckPhone(pool: sql.ConnectionPool, phone: string): Promise<boolean> {
    const conn = await pool;
    const existing = await conn
        .request()
        .input('phone', sql.NVarChar(255), phone)
        .query('SELECT 1 FROM dbo.customer WHERE phone = @phone');

    if (existing.recordset.length > 0) {
        return true;
    }
    return false;
}

async function CreateToDB(
    pool: sql.ConnectionPool,
    createCustomerBody: CreateCustomerBodyField
): Promise<sql.IProcedureResult<CustomerField>> {
    const conn = await pool;
    const result = await conn
        .request()
        .input('phone', sql.NVarChar(255), createCustomerBody.phone)
        .input('password', sql.NVarChar(255), createCustomerBody.password)
        .execute('CreateCustomer');

    return result;
}

export default MutateDB_CreateCustomer;
