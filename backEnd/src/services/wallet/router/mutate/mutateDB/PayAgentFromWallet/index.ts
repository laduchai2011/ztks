import sql from 'mssql';
import { WalletField } from '@src/dataStruct/wallet';
import { PayAgentFromWalletBodyField } from '@src/dataStruct/wallet/body';

class MutateDB_PayAgentFromWallet {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _payAgentFromWalletBody: PayAgentFromWalletBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setPayAgentFromWalletBody(payAgentFromWalletBody: PayAgentFromWalletBodyField): void {
        this._payAgentFromWalletBody = payAgentFromWalletBody;
    }

    async run(): Promise<sql.IProcedureResult<WalletField> | undefined> {
        if (this._connectionPool !== undefined && this._payAgentFromWalletBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('walletId', sql.Int, this._payAgentFromWalletBody.walletId)
                    .input('agentPayId', sql.Int, this._payAgentFromWalletBody.agentPayId)
                    .input('accountId', sql.Int, this._payAgentFromWalletBody.accountId)
                    .execute('PayAgentFromWallet');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_PayAgentFromWallet;
