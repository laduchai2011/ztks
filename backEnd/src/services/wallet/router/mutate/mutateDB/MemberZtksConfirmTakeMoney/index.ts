import sql from 'mssql';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { MemberZtksConfirmTakeMoneyBodyField } from '@src/dataStruct/wallet/body';

class MutateDB_EditRequireTakeMoney {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _memberZtksConfirmTakeMoneyBody: MemberZtksConfirmTakeMoneyBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setMemberZtksConfirmTakeMoneyBody(memberZtksConfirmTakeMoneyBody: MemberZtksConfirmTakeMoneyBodyField): void {
        this._memberZtksConfirmTakeMoneyBody = memberZtksConfirmTakeMoneyBody;
    }

    async run(): Promise<sql.IProcedureResult<RequireTakeMoneyField> | undefined> {
        if (this._connectionPool !== undefined && this._memberZtksConfirmTakeMoneyBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('requireTakeMoneyId', sql.Int, this._memberZtksConfirmTakeMoneyBody.requireTakeMoneyId)
                    .input('memberZtksId', sql.Int, this._memberZtksConfirmTakeMoneyBody.memberZtksId)
                    .execute('MemberZtksConfirmTakeMoney');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_EditRequireTakeMoney;
