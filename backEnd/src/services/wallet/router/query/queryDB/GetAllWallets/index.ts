import sql from 'mssql';
import { WalletField } from '@src/dataStruct/wallet';
import { GetAllWalletsBodyField } from '@src/dataStruct/wallet/body';

class QueryDB_GetAllWallets {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getAllWalletsBody: GetAllWalletsBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetAllWalletsBody(getAllWalletsBody: GetAllWalletsBodyField): void {
        this._getAllWalletsBody = getAllWalletsBody;
    }

    async run(): Promise<sql.IProcedureResult<WalletField[]> | void> {
        if (this._connectionPool !== undefined && this._getAllWalletsBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('type', sql.VarChar(8), this._getAllWalletsBody.type)
                    .input('accountId', sql.Int, this._getAllWalletsBody.accountId)
                    .execute('GetAllWallets');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAllWallets;
