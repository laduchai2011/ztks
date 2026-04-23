import sql from 'mssql';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { MemberZtksGetRequiresTakeMoneyBodyField } from '@src/dataStruct/wallet/body';

interface TotalCountField {
    totalCount: number;
}

type RequireTakeMoneyQueryResult = {
    recordsets: [RequireTakeMoneyField[], TotalCountField[]];
    recordset: RequireTakeMoneyField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_MemberZtksGetRequiresTakeMoney {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _memberZtksGetRequiresTakeMoneyBody: MemberZtksGetRequiresTakeMoneyBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setMemberZtksGetRequiresTakeMoneyBody(
        memberZtksGetRequiresTakeMoneyBody: MemberZtksGetRequiresTakeMoneyBodyField
    ): void {
        this._memberZtksGetRequiresTakeMoneyBody = memberZtksGetRequiresTakeMoneyBody;
    }

    async run(): Promise<RequireTakeMoneyQueryResult | void> {
        if (this._connectionPool !== undefined && this._memberZtksGetRequiresTakeMoneyBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._memberZtksGetRequiresTakeMoneyBody.page)
                    .input('size', sql.Int, this._memberZtksGetRequiresTakeMoneyBody.size)
                    .input('memberZtksId', sql.Int, this._memberZtksGetRequiresTakeMoneyBody.memberZtksId ?? null)
                    .input('isDo', sql.Bit, this._memberZtksGetRequiresTakeMoneyBody.isDo ?? null)
                    .input('moneyFrom', sql.Decimal(20, 2), this._memberZtksGetRequiresTakeMoneyBody.moneyFrom ?? null)
                    .input('moneyTo', sql.Decimal(20, 2), this._memberZtksGetRequiresTakeMoneyBody.moneyTo ?? null)
                    .input(
                        'doFromDate',
                        sql.DateTime2,
                        this._memberZtksGetRequiresTakeMoneyBody.doFromDate
                            ? new Date(this._memberZtksGetRequiresTakeMoneyBody.doFromDate)
                            : null
                    )
                    .input(
                        'doToDate',
                        sql.DateTime2,
                        this._memberZtksGetRequiresTakeMoneyBody.doToDate
                            ? new Date(this._memberZtksGetRequiresTakeMoneyBody.doToDate)
                            : null
                    )
                    .input(
                        'fromDate',
                        sql.DateTime2,
                        this._memberZtksGetRequiresTakeMoneyBody.fromDate
                            ? new Date(this._memberZtksGetRequiresTakeMoneyBody.fromDate)
                            : null
                    )
                    .input(
                        'toDate',
                        sql.DateTime2,
                        this._memberZtksGetRequiresTakeMoneyBody.toDate
                            ? new Date(this._memberZtksGetRequiresTakeMoneyBody.toDate)
                            : null
                    )
                    .execute('MemberZtksGetRequiresTakeMoney');

                return result as any as RequireTakeMoneyQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_MemberZtksGetRequiresTakeMoney;
