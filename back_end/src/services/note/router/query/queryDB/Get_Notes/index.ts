import { pool } from '@src/connect/postgresql';
import { Note_Field, Paged_Note_Field } from '@src/data_struct/note';
import { Get_Notes_Body_Field } from '@src/data_struct/note/body';

class QueryDB_Get_Notes {
    private _get_notes_body: Get_Notes_Body_Field | undefined;

    set_Get_Notes_Body(get_notes_body: Get_Notes_Body_Field): void {
        this._get_notes_body = get_notes_body;
    }

    async run(): Promise<Paged_Note_Field | void> {
        if (this._get_notes_body !== undefined) {
            const is_delete = this._get_notes_body.is_delete ? this._get_notes_body.is_delete : null;

            try {
                const result = await pool.query<{
                    items: Note_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_my_notes($1, $2, $3, $4, $5, $6);`, [
                    this._get_notes_body.page,
                    this._get_notes_body.size,
                    this._get_notes_body.offset,
                    this._get_notes_body.chat_room_id,
                    this._get_notes_body.account_id,
                    is_delete,
                ]);

                const data: Paged_Note_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count),
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Notes;
