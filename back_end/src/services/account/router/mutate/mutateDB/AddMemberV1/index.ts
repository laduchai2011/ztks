import sql from 'mssql';
import { AccountInformationField } from '@src/dataStruct/account';
import { AddMemberV1BodyField } from '@src/dataStruct/account/body';

class MutateDB_AddMemberV1 {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _addMemberV1Body: AddMemberV1BodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setAddMemberV1Body(addMemberV1Body: AddMemberV1BodyField): void {
        this._addMemberV1Body = addMemberV1Body;
    }

    async run(): Promise<sql.IProcedureResult<AccountInformationField> | undefined> {
        if (this._connectionPool !== undefined && this._addMemberV1Body !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('addedById', sql.Int, this._addMemberV1Body.addedById)
                    .input('accountId', sql.Int, this._addMemberV1Body.accountId)
                    .execute('AddMemberV1');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_AddMemberV1;
