import sql from 'mssql';
import { AccountInformationField } from '@src/dataStruct/account';
import { CreateAccountInformationBodyField } from '@src/dataStruct/account/body';

class MutateDB_CreateAccountInformation {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createAccountInformationBody: CreateAccountInformationBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateAccountInformationBody(createAccountInformationBody: CreateAccountInformationBodyField): void {
        this._createAccountInformationBody = createAccountInformationBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountInformationField> | undefined> {
        if (this._connectionPool !== undefined && this._createAccountInformationBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountType', sql.NVarChar(255), this._createAccountInformationBody.accountType)
                    .input('accountId', sql.Int, this._createAccountInformationBody.accountId)
                    .execute('CreateAccountInformation');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateAccountInformation;
