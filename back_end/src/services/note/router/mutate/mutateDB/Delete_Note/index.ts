import { pool } from '@src/connect/postgresql';
import { Note_Field } from '@src/data_struct/note';
import { Delete_Note_Body_Field } from '@src/data_struct/note/body';

class MutateDB_Delete_Note {
    private _delete_note_body: Delete_Note_Body_Field | undefined;

    set_Delete_Note_Body(delete_note_body: Delete_Note_Body_Field): void {
        this._delete_note_body = delete_note_body;
    }

    async run(): Promise<Note_Field | undefined> {
        if (this._delete_note_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Note_Field>(`SELECT * FROM delete_note($1, $2);`, [
                    this._delete_note_body.id,
                    this._delete_note_body.account_id,
                ]);

                await client.query('COMMIT');

                return result.rows[0];
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Delete_Note;
