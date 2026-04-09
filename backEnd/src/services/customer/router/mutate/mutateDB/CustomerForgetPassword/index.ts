import sql from 'mssql';
import { CustomerField } from '@src/dataStruct/customer';
import { CustomerForgetPasswordBodyField } from '@src/dataStruct/customer/body';

class MutateDB_CustomerForgetPassword {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _customerForgetPasswordBody: CustomerForgetPasswordBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCustomerForgetPasswordBody(customerForgetPasswordBody: CustomerForgetPasswordBodyField): void {
        this._customerForgetPasswordBody = customerForgetPasswordBody;
    }

    async run(): Promise<sql.IProcedureResult<CustomerField> | undefined> {
        if (this._connectionPool !== undefined && this._customerForgetPasswordBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('phone', sql.NVarChar(255), this._customerForgetPasswordBody.phone)
                    .input('password', sql.NVarChar(255), this._customerForgetPasswordBody.password)
                    .execute('CustomerForgetPassword');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CustomerForgetPassword;
