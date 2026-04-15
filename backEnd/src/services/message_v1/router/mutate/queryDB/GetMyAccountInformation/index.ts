import sql from 'mssql';
import { AccountInformationField } from '@src/dataStruct/account';
import { GetMyAccountInformationBodyField } from '@src/dataStruct/account/body';

class QueryDB_GetMyAccountInformation {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getMyAccountInformationBody: GetMyAccountInformationBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetMyAccountInformationBody(getMyAccountInformationBody: GetMyAccountInformationBodyField): void {
        this._getMyAccountInformationBody = getMyAccountInformationBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountInformationField> | void> {
        if (this._connectionPool !== undefined && this._getMyAccountInformationBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._getMyAccountInformationBody.accountId)
                    .execute('GetMyAccountInformation');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMyAccountInformation;
