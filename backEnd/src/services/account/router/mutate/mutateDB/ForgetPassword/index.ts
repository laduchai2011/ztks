import sql from 'mssql';
import { AccountField } from '@src/dataStruct/account';
import { ForgetPasswordBodyField } from '@src/dataStruct/account/body';

class MutateDB_ForgetPassword {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _forgetPasswordBody: ForgetPasswordBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setForgetPasswordBody(forgetPasswordBody: ForgetPasswordBodyField): void {
        this._forgetPasswordBody = forgetPasswordBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountField> | undefined> {
        if (this._connectionPool !== undefined && this._forgetPasswordBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('userName', sql.NVarChar(100), this._forgetPasswordBody.userName)
                    .input('password', sql.NVarChar(100), this._forgetPasswordBody.password)
                    .input('phone', sql.NVarChar(15), this._forgetPasswordBody.phone)
                    .execute('ForgetPassword');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_ForgetPassword;
