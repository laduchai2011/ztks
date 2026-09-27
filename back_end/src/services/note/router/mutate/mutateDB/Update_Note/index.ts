import { pool } from '@src/connect/postgresql';
import { Note_Field } from '@src/data_struct/note';
import { Update_Note_Body_Field } from '@src/data_struct/note/body';

class MutateDB_Update_Note {
    private _update_note_body: Update_Note_Body_Field | undefined;

    set_Update_Note_Body(update_note_body: Update_Note_Body_Field): void {
        this._update_note_body = update_note_body;
    }

    async run(): Promise<Note_Field | undefined> {
        if (this._update_note_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Note_Field>('SELECT * FROM update_note($1::UUID, $2, $3::UUID)', [
                    this._update_note_body.id,
                    this._update_note_body.note,
                    this._update_note_body.account_id,
                ]);

                await client.query('COMMIT');

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Update_Note;
