import sql from 'mssql';
import { MutateDB } from '@src/services/note/interface';
import { NoteField } from '@src/dataStruct/note';
import { CreateNoteBodyField } from '@src/dataStruct/note/body';

class MutateDB_CreateNote extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _createNoteBody: CreateNoteBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setCreateNoteBody(createNoteBody: CreateNoteBodyField): void {
        this._createNoteBody = createNoteBody;
    }

    async run(): Promise<sql.IProcedureResult<NoteField> | undefined> {
        if (this._connectionPool !== undefined && this._createNoteBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('note', sql.NVarChar(255), this._createNoteBody.note)
                    .input('chatRoomId', sql.Int, this._createNoteBody.chatRoomId)
                    .input('zaloOaId', sql.Int, this._createNoteBody.zaloOaId)
                    .input('accountId', sql.Int, this._createNoteBody.accountId)
                    .execute('CreateNote');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_CreateNote;
