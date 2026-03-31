import sql from 'mssql';
import { AccountField } from '@src/dataStruct/account';
import { EditInforAccountBodyField } from '@src/dataStruct/account/body';

class MutateDB_EditInforAccount {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _editInforAccountBody: EditInforAccountBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setEditInforAccountBody(editInforAccountBody: EditInforAccountBodyField): void {
        this._editInforAccountBody = editInforAccountBody;
    }

    async run(): Promise<sql.IProcedureResult<AccountField> | undefined> {
        if (this._connectionPool !== undefined && this._editInforAccountBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._editInforAccountBody.id)
                    .input('firstName', sql.NVarChar(255), this._editInforAccountBody.firstName)
                    .input('lastName', sql.NVarChar(255), this._editInforAccountBody.lastName)
                    .input('avatar', sql.NVarChar(255), this._editInforAccountBody.avatar ?? null)
                    .execute('EditInforAccount');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_EditInforAccount;
