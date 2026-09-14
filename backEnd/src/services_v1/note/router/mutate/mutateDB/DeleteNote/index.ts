import sql from 'mssql';
import { NoteField } from '@src/dataStruct/note';
import { DeleteNoteBodyField } from '@src/dataStruct/note/body';

class MutateDB_DeleteNote {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _deleteNoteBody: DeleteNoteBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setDeleteNoteBody(deleteNoteBody: DeleteNoteBodyField): void {
        this._deleteNoteBody = deleteNoteBody;
    }

    async run(): Promise<sql.IProcedureResult<NoteField> | undefined> {
        if (this._connectionPool !== undefined && this._deleteNoteBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._deleteNoteBody.id)
                    .input('accountId', sql.Int, this._deleteNoteBody.accountId)
                    .execute('DeleteNote');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_DeleteNote;
