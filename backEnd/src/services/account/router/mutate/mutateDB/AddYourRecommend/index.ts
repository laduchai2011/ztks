import sql from 'mssql';
import { RecommendField } from '@src/dataStruct/account';
import { AddYourRecommendBodyField } from '@src/dataStruct/account/body';

class MutateDB_AddYourRecommend {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _addYourRecommendBody: AddYourRecommendBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setAddYourRecommendBody(addYourRecommendBody: AddYourRecommendBodyField): void {
        this._addYourRecommendBody = addYourRecommendBody;
    }

    async run(): Promise<sql.IProcedureResult<RecommendField> | undefined> {
        if (this._connectionPool !== undefined && this._addYourRecommendBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('yourCode', sql.VarChar(255), this._addYourRecommendBody.yourCode)
                    .input('accountId', sql.Int, this._addYourRecommendBody.accountId)
                    .execute('AddYourRecommend');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_AddYourRecommend;
