import sql from 'mssql';
import { WalletField } from '@src/dataStruct/wallet';
import { GetMyWalletWithTypeBodyField } from '@src/dataStruct/wallet/body';

class QueryDB_GetMyWalletWithType {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getMyWalletWithTypeBody: GetMyWalletWithTypeBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetMyWalletWithTypeBody(getMyWalletWithTypeBody: GetMyWalletWithTypeBodyField): void {
        this._getMyWalletWithTypeBody = getMyWalletWithTypeBody;
    }

    async run(): Promise<sql.IProcedureResult<WalletField> | void> {
        if (this._connectionPool !== undefined && this._getMyWalletWithTypeBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('type', sql.VarChar(8), this._getMyWalletWithTypeBody.type)
                    .input('accountId', sql.Int, this._getMyWalletWithTypeBody.accountId)
                    .execute('GetMyWalletWithType');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMyWalletWithType;
