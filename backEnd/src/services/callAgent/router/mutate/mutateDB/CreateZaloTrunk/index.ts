import sql from 'mssql';
import { ZaloTrunkField } from '@src/dataStruct/callAgent';
import { CreateZaloTrunkBodyField } from '@src/dataStruct/callAgent/body';

class MutateDB_CreateZaloTrunk {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createZaloTrunkBody: CreateZaloTrunkBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateZaloTrunkBody(createZaloTrunkBody: CreateZaloTrunkBodyField): void {
        this._createZaloTrunkBody = createZaloTrunkBody;
    }

    async run(): Promise<sql.IProcedureResult<ZaloTrunkField> | undefined> {
        if (this._connectionPool !== undefined && this._createZaloTrunkBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('trunkCode', sql.NVarChar(255), this._createZaloTrunkBody.trunkCode)
                    .input('domain', sql.NVarChar(255), this._createZaloTrunkBody.domain)
                    .input('appId', sql.NVarChar(255), this._createZaloTrunkBody.appId)
                    .input('oaId', sql.NVarChar(255), this._createZaloTrunkBody.oaId)
                    .input('port', sql.NVarChar(255), this._createZaloTrunkBody.port)
                    .input('accountId', sql.Int, this._createZaloTrunkBody.accountId)
                    .execute('CreateZaloTrunk');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateZaloTrunk;
