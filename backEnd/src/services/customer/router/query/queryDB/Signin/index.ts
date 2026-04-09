import sql from 'mssql';
import { CustomerField } from '@src/dataStruct/customer';
import { SigninCustomerBodyField } from '@src/dataStruct/customer/body';

class QueryDB_Signin {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _signinCustomerBody: SigninCustomerBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setSigninCustomerBody(signinCustomerBody: SigninCustomerBodyField): void {
        this._signinCustomerBody = signinCustomerBody;
    }

    async run(): Promise<sql.IResult<CustomerField> | undefined> {
        if (this._connectionPool !== undefined && this._signinCustomerBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('userName', sql.NVarChar(255), this._signinCustomerBody.phone)
                    .input('password', sql.NVarChar(255), this._signinCustomerBody.password)
                    .query(`SELECT * FROM dbo.Signin(@userName, @password)`);

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Signin;
