import sql from 'mssql';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { MemberGetRequireTakeMoneyOfWalletBodyField } from '@src/dataStruct/wallet/body';

class QueryDB_MemberGetRequireTakeMoneyOfWallet {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _memberGetRequireTakeMoneyOfWalletBody: MemberGetRequireTakeMoneyOfWalletBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setMemberGetRequireTakeMoneyOfWalletBody(
        memberGetRequireTakeMoneyOfWalletBody: MemberGetRequireTakeMoneyOfWalletBodyField
    ): void {
        this._memberGetRequireTakeMoneyOfWalletBody = memberGetRequireTakeMoneyOfWalletBody;
    }

    async run(): Promise<sql.IProcedureResult<RequireTakeMoneyField> | void> {
        if (this._connectionPool !== undefined && this._memberGetRequireTakeMoneyOfWalletBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('walletId', sql.Int, this._memberGetRequireTakeMoneyOfWalletBody.walletId)
                    .input('accountId', sql.Int, this._memberGetRequireTakeMoneyOfWalletBody.accountId)
                    .execute('MemberGetRequireTakeMoneyOfWallet');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_MemberGetRequireTakeMoneyOfWallet;
