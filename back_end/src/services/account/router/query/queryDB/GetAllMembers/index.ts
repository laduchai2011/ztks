import sql from 'mssql';
import { QueryDB } from '@src/services/account/interface';
import { AccountField, AllMembersBodyField } from '@src/dataStruct/account';

class QueryDB_GetAllMembers extends QueryDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _allMembersBody: AllMembersBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setAllMembersBody(allMembersBody: AllMembersBodyField): void {
        this._allMembersBody = allMembersBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountField[]> | void> {
        if (this._connectionPool !== undefined && this._allMembersBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('addedById', sql.Int, this._allMembersBody.addedById)
                    .execute('GetAllMembers');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetAllMembers;
