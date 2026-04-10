import sql from 'mssql';
import { WalletField } from '@src/dataStruct/wallet';
import { CreateWalletBodyField } from '@src/dataStruct/wallet/body';

class MutateDB_CreateWallet {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createWalletBody: CreateWalletBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateWalletBody(createWalletBody: CreateWalletBodyField): void {
        this._createWalletBody = createWalletBody;
    }

    async run(): Promise<sql.IProcedureResult<WalletField> | undefined> {
        if (this._connectionPool !== undefined && this._createWalletBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('amount', sql.Decimal(20, 2), 0)
                    .input('type', sql.NVarChar(255), this._createWalletBody.type)
                    .input('accountId', sql.Int, this._createWalletBody.accountId)
                    .execute('CreateWallet');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateWallet;
