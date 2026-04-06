import sql from 'mssql';
import { RecommendField } from '@src/dataStruct/account';
import { GetMyRecommendBodyField } from '@src/dataStruct/account/body';

class QueryDB_GetMyRecommend {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getMyRecommendBody: GetMyRecommendBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetMyRecommendBody(getMyRecommendBody: GetMyRecommendBodyField): void {
        this._getMyRecommendBody = getMyRecommendBody;
    }

    async run(): Promise<sql.IProcedureResult<RecommendField> | void> {
        if (this._connectionPool !== undefined && this._getMyRecommendBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('accountId', sql.Int, this._getMyRecommendBody.accountId)
                    .execute('GetMyRecommend');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetMyRecommend;
