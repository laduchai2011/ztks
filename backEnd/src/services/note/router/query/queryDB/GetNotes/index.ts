import sql from 'mssql';
import { NoteField } from '@src/dataStruct/note';
import { GetNotesBodyField } from '@src/dataStruct/note/body';

interface TotalCountField {
    totalCount: number;
}

type NoteQueryResult = {
    recordsets: [NoteField[], TotalCountField[]];
    recordset: NoteField[]; // tập đầu tiên
    rowsAffected: number[];
    output: Record<string, unknown>;
};

class QueryDB_GetNotes {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _getNotesBodyField: GetNotesBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setGetNotesBody(getNoteBodyField: GetNotesBodyField): void {
        this._getNotesBodyField = getNoteBodyField;
    }

    async run(): Promise<NoteQueryResult | void> {
        if (this._connectionPool !== undefined && this._getNotesBodyField !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('page', sql.Int, this._getNotesBodyField.page)
                    .input('size', sql.Int, this._getNotesBodyField.size)
                    .input('offset', sql.Int, this._getNotesBodyField.offset)
                    .input('chatRoomId', sql.Int, this._getNotesBodyField.chatRoomId ?? null)
                    .input('zaloOaId', sql.Int, this._getNotesBodyField.zaloOaId ?? null)
                    .input('accountId', sql.Int, this._getNotesBodyField.accountId)
                    .execute('GetMyNotes');

                return result as unknown as NoteQueryResult;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_GetNotes;
