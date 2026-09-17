import { pool } from '@src/connect/postgresql';
import { Note_Field } from '@src/data_struct/note';
import { Create_Note_Body_Field } from '@src/data_struct/note/body';

class MutateDB_Create_Note {
    private _create_note_body: Create_Note_Body_Field | undefined;

    set_Create_Note_Body(create_note_body: Create_Note_Body_Field): void {
        this._create_note_body = create_note_body;
    }

    async run(): Promise<Note_Field | undefined> {
        if (this._create_note_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Note_Field>(`SELECT * FROM delete_note($1, $2, $3);`, [
                    this._create_note_body.note,
                    this._create_note_body.chat_room_id,
                    this._create_note_body.account_id,
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

export default MutateDB_Create_Note;
