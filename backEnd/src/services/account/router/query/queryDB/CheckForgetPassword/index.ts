import sql from 'mssql';
import { AccountField } from '@src/dataStruct/account';
import { CheckForgetPasswordBodyField } from '@src/dataStruct/account/body';

class QueryDB_CheckForgetPassword {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _checkForgetPasswordBody: CheckForgetPasswordBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCheckForgetPasswordBody(checkForgetPasswordBody: CheckForgetPasswordBodyField): void {
        this._checkForgetPasswordBody = checkForgetPasswordBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountField> | void> {
        if (this._connectionPool !== undefined && this._checkForgetPasswordBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('userName', sql.NVarChar(100), this._checkForgetPasswordBody.userName)
                    .input('phone', sql.NVarChar(15), this._checkForgetPasswordBody.phone)
                    .execute('CheckForgetPassword');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_CheckForgetPassword;
