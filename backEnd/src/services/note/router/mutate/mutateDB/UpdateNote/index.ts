import sql from 'mssql';
import { NoteField } from '@src/dataStruct/note';
import { UpdateNoteBodyField } from '@src/dataStruct/note/body';

class MutateDB_UpdateNote {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateNoteBody: UpdateNoteBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateNoteBody(updateNoteBody: UpdateNoteBodyField): void {
        this._updateNoteBody = updateNoteBody;
    }

    async run(): Promise<sql.IProcedureResult<NoteField> | undefined> {
        if (this._connectionPool !== undefined && this._updateNoteBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._updateNoteBody.id)
                    .input('note', sql.NVarChar(sql.MAX), this._updateNoteBody.note)
                    .input('accountId', sql.Int, this._updateNoteBody.accountId)
                    .execute('UpdateNote');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateNote;
